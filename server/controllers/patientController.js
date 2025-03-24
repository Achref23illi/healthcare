// server/controllers/patientController.js

const Patient = require('../models/Patient');
const User = require('../models/User');

/**
 * @desc    Get all patients for the logged-in doctor
 * @route   GET /api/patients
 * @access  Private/Doctor
 */
exports.getPatients = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to access patients' });
    }

    // Find all patients for this doctor
    const patients = await Patient.find({ doctor: req.user.id })
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a new patient
 * @route   POST /api/patients
 * @access  Private/Doctor
 */
exports.addPatient = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to add patients' });
    }

    const { firstName, lastName, age, chronicDisease, temperature, heartRate, oxygenSaturation } = req.body;

    // Create new patient
    const newPatient = new Patient({
      firstName,
      lastName,
      age,
      chronicDisease: chronicDisease || '',
      temperature: temperature || null,
      heartRate: heartRate || null,
      oxygenSaturation: oxygenSaturation || null,
      doctor: req.user.id,
      status: 'Stable'
    });

    const patient = await newPatient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error adding patient:', error);
    
    if (error.name === 'ValidationError') {
      // Handle validation errors
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a patient by ID
 * @route   GET /api/patients/:id
 * @access  Private/Doctor
 */
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Make sure patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this patient' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a patient
 * @route   PUT /api/patients/:id
 * @access  Private/Doctor
 */
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Make sure patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this patient' });
    }

    // Fields to update
    const { firstName, lastName, age, chronicDisease, status } = req.body;

    // Update patient fields
    if (firstName) patient.firstName = firstName;
    if (lastName) patient.lastName = lastName;
    if (age) patient.age = age;
    if (chronicDisease !== undefined) patient.chronicDisease = chronicDisease;
    if (status) patient.status = status;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a patient
 * @route   DELETE /api/patients/:id
 * @access  Private/Doctor
 */
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Make sure patient belongs to the logged-in doctor
    if (patient.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this patient' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get the doctor of a patient
 * @route   GET /api/patients/my-doctor
 * @access  Private/Patient
 */
exports.getMyDoctor = async (req, res) => {
  try {
    // Ensure the user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied: Only patients can view their doctor' });
    }

    // Find the patient to get the assigned doctor ID
    const patient = await User.findById(req.user._id);
    if (!patient.assignedDoctor) {
      return res.status(404).json({ message: 'You do not have an assigned doctor' });
    }

    // Get doctor details
    const doctor = await User.findById(patient.assignedDoctor).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};