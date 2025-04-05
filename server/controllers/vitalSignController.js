// controllers/vitalSignController.js
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const { validationResult } = require('express-validator');

// Enhanced thresholds with more comprehensive ranges
const thresholds = {
  temperature: { low: 35.5, high: 38.0 },
  heartRate: { low: 60, high: 100 },
  oxygenSaturation: { low: 95, high: 100 },
  respiratoryRate: { low: 12, high: 20 }, // Added respiratory rate thresholds
  bloodPressure: { low: '90/60', high: '140/90' } // Added blood pressure thresholds
};

// Critical thresholds for determining severe alerts
const criticalThresholds = {
  temperature: { low: 35.0, high: 39.5 },
  heartRate: { low: 50, high: 120 },
  oxygenSaturation: { low: 90, high: 100 },
  respiratoryRate: { low: 8, high: 25 }
};

// Add a vital sign reading for a patient
exports.addVitalSign = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { patientId } = req.params;
    const { type, value, unit } = req.body;
    
    console.log(`Recording vital: ${type} = ${value}${unit} for patient ${patientId}`);
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add vitals for this patient' });
    }
    
    // Check if the value is outside of normal range
    let isAlert = false;
    let alertSeverity = 'Medium';
    let createdAlert = null;
    
    if (thresholds[type]) {
      const { low, high } = thresholds[type];
      isAlert = (value < low || value > high);
      
      // Log the value and thresholds for debugging
      console.log(`Vital check: ${type}, value: ${value}, thresholds: ${low}-${high}, isAlert: ${isAlert}`);

      // If it's an alert, create an alert record with appropriate severity
      if (isAlert) {
        // Determine if the reading is critical
        const isCritical = criticalThresholds[type] && 
          (value < criticalThresholds[type].low || value > criticalThresholds[type].high);
        
        // Set severity based on how far outside the range
        if (isCritical) {
          alertSeverity = 'Critical';
        } else {
          // Calculate deviation percentage for severity determination
          const midPoint = (low + high) / 2;
          const deviation = Math.abs(value - midPoint) / midPoint;
          
          if (deviation > 0.15) { // More than 15% deviation
            alertSeverity = 'High';
          } else if (deviation > 0.05) { // More than 5% deviation
            alertSeverity = 'Medium';
          } else {
            alertSeverity = 'Low';
          }
        }
        
        const alertMessage = `${type} reading of ${value} ${unit} is outside normal range (${low}-${high} ${unit})`;
        console.log(`Creating alert with severity: ${alertSeverity}`);
        
        try {
          createdAlert = await Alert.create({
            patient: patientId,
            doctor: req.user.id,
            type: 'vital_sign',
            message: alertMessage,
            severity: alertSeverity,
            status: 'New'
          });
          
          console.log(`Alert created successfully with ID: ${createdAlert._id}`);
        } catch (alertError) {
          console.error('Error creating alert:', alertError);
          // Continue execution even if alert creation fails
        }
      }
    }
    
    // Create new vital sign
    const vitalSign = {
      type,
      value,
      unit,
      timestamp: new Date(),
      isAlert
    };
    
    // Add the vital sign to the patient
    patient.vitalSigns.push(vitalSign);
    
    // Update the latest vitals
    await patient.updateLatestVitals(vitalSign);
    
    // Update patient status if needed
    if (isAlert) {
      if (alertSeverity === 'Critical') {
        patient.status = 'Critical';
      } else if (alertSeverity === 'High' && patient.status !== 'Critical') {
        patient.status = 'Under Observation';
      }
      
      await patient.save();
    } else {
      await patient.save();
    }
    
    // Return the created alert along with the vital sign
    res.status(201).json({
      vitalSign,
      message: isAlert ? 'Vital sign recorded with alert' : 'Vital sign recorded successfully',
      alert: createdAlert,
      alertCreated: !!createdAlert
    });
  } catch (error) {
    console.error('Error adding vital sign:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vital signs for a patient
exports.getVitalSigns = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type } = req.query;
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view vitals for this patient' });
    }
    
    // Filter vital signs by type if specified
    let vitalSigns = patient.vitalSigns;
    
    if (type) {
      vitalSigns = vitalSigns.filter(v => v.type === type);
    }
    
    // Sort by timestamp (newest first)
    vitalSigns.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(vitalSigns);
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};