// controllers/alertController.js
const Alert = require('../models/Alert');
const Patient = require('../models/Patient');

// Get all alerts for the logged-in doctor
exports.getAlerts = async (req, res) => {
  try {
    // Build filter query
    let query = { doctor: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.patient) {
      query.patient = req.query.patient;
    }
    
    // Execute query
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .populate('patient', 'firstName lastName age');
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a custom alert
exports.createAlert = async (req, res) => {
  try {
    const { patient: patientId, message, severity = 'Medium', type = 'custom' } = req.body;
    
    // Check if patient exists and belongs to the doctor
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (patient.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create alerts for this patient' });
    }
    
    // Create alert
    const alert = await Alert.create({
      patient: patientId,
      doctor: req.user.id,
      type,
      message,
      severity,
      status: 'New'
    });
    
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update alert status
exports.updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Acknowledged', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this alert' });
    }
    
    // Update alert status
    alert.status = status;
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ message: 'Server error' });
  }
};