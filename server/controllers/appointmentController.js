// server/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all appointments for the logged-in doctor
 * @route   GET /api/appointments
 * @access  Private/Doctor
 */
exports.getAppointments = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to access appointments' });
    }

    // Parse query parameters
    const { status, startDate, endDate, patientId } = req.query;
    
    // Build query
    const query = { doctor: req.user.id };
    
    if (status && ['confirmed', 'pending', 'cancelled'].includes(status)) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    if (patientId) {
      query.patient = patientId;
    }
    
    // Execute query with population
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get appointments for a specific patient
 * @route   GET /api/appointments/patient/:patientId
 * @access  Private/Doctor
 */
exports.getPatientAppointments = async (req, res) => {
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to access appointments' });
    }

    const { patientId } = req.params;
    
    // Verify patient exists and belongs to the doctor
    const patient = await Patient.findOne({ 
      _id: patientId,
      doctor: req.user.id
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or not assigned to you' });
    }
    
    // Get appointments
    const appointments = await Appointment.find({
      doctor: req.user.id,
      patient: patientId
    }).sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a specific appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private/Doctor
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName age chronicDisease');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this appointment' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private/Doctor
 */
exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  
  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to create appointments' });
    }
    
    const { 
      patient: patientId, 
      date, 
      duration, 
      type, 
      notes, 
      status = 'pending' 
    } = req.body;
    
    // Verify patient exists and belongs to the doctor
    const patient = await Patient.findOne({ 
      _id: patientId,
      doctor: req.user.id
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or not assigned to you' });
    }
    
    // Check for appointment conflicts
    const appointmentDate = new Date(date);
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + parseInt(duration));
    
    const conflictingAppointments = await Appointment.find({
      doctor: req.user.id,
      status: 'confirmed',
      $or: [
        // New appointment starts during an existing appointment
        {
          date: { $lte: appointmentDate },
          endTime: { $gt: appointmentDate }
        },
        // New appointment ends during an existing appointment
        {
          date: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        // New appointment fully contains an existing appointment
        {
          date: { $gte: appointmentDate },
          endTime: { $lte: endTime }
        }
      ]
    });
    
    if (conflictingAppointments.length > 0) {
      return res.status(409).json({ message: 'Appointment time conflicts with an existing appointment' });
    }
    
    // Create appointment
    const newAppointment = new Appointment({
      patient: patientId,
      doctor: req.user.id,
      date: appointmentDate,
      duration,
      type,
      notes,
      status
    });
    
    const savedAppointment = await newAppointment.save();
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update an appointment
 * @route   PUT /api/appointments/:id
 * @access  Private/Doctor
 */
exports.updateAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    const { date, duration, type, notes, status } = req.body;
    
    // Only update fields that are provided
    if (date) appointment.date = new Date(date);
    if (duration) appointment.duration = duration;
    if (type) appointment.type = type;
    if (notes !== undefined) appointment.notes = notes;
    if (status) appointment.status = status;
    
    // If date or duration changed, check for conflicts
    if (date || duration) {
      const appointmentDate = appointment.date;
      const endTime = new Date(appointmentDate);
      endTime.setMinutes(endTime.getMinutes() + parseInt(appointment.duration));
      
      const conflictingAppointments = await Appointment.find({
        doctor: req.user.id,
        _id: { $ne: appointment._id }, // Exclude current appointment
        status: 'confirmed',
        $or: [
          // Appointment starts during an existing appointment
          {
            date: { $lte: appointmentDate },
            endTime: { $gt: appointmentDate }
          },
          // Appointment ends during an existing appointment
          {
            date: { $lt: endTime },
            endTime: { $gte: endTime }
          },
          // Appointment fully contains an existing appointment
          {
            date: { $gte: appointmentDate },
            endTime: { $lte: endTime }
          }
        ]
      });
      
      if (conflictingAppointments.length > 0) {
        return res.status(409).json({ message: 'Appointment time conflicts with an existing appointment' });
      }
    }
    
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete an appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private/Doctor
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }
    
    await appointment.deleteOne();
    
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get my appointments (for patients)
 * @route   GET /api/appointments/my-appointments
 * @access  Private/Patient
 */
exports.getMyAppointments = async (req, res) => {
  try {
    // Check if user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get patient document id
    const patientInfo = await Patient.findOne({ userId: req.user.id });
    
    if (!patientInfo) {
      return res.status(404).json({ message: 'Patient record not found' });
    }
    
    // Find appointments
    const appointments = await Appointment.find({
      patient: patientInfo._id
    })
    .populate('doctor', 'name') // Populate doctor info
    .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};