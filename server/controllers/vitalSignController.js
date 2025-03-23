// controllers/vitalSignController.js
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const { validationResult } = require('express-validator');

// Basic thresholds
const thresholds = {
  temperature: { low: 35.5, high: 38.0 },
  heartRate: { low: 60, high: 100 },
  oxygenSaturation: { low: 95, high: 100 }
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
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add vitals for this patient' });
    }
    
    // Check if the value is outside of normal range
    let isAlert = false;
    if (thresholds[type]) {
      const { low, high } = thresholds[type];
      isAlert = (value < low || value > high);
      
      // If it's an alert, create an alert record
      if (isAlert) {
        const alertMessage = `${type} reading of ${value} ${unit} is outside normal range (${low}-${high} ${unit})`;
        await Alert.create({
          patient: patientId,
          doctor: req.user.id,
          type: 'vital_sign',
          message: alertMessage,
          severity: value < low ? 'Low' : 'High',
          status: 'New'
        });
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
      const isCritical = (
        (type === 'temperature' && (value > 39.5 || value < 35)) ||
        (type === 'heartRate' && (value > 120 || value < 50)) ||
        (type === 'oxygenSaturation' && value < 90)
      );
      
      if (isCritical) {
        patient.status = 'Critical';
      } else if (patient.status !== 'Critical') {
        patient.status = 'Under Observation';
      }
      
      await patient.save();
    }
    
    await patient.save();
    
    res.status(201).json({
      vitalSign,
      message: isAlert ? 'Vital sign recorded with alert' : 'Vital sign recorded successfully'
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