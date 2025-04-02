// server/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get all appointments for the logged-in doctor
router.get('/', appointmentController.getAppointments);

// Get a specific appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Get appointments for a specific patient
router.get('/patient/:patientId', appointmentController.getPatientAppointments);

// Get my appointments (for patients)
router.get('/my-appointments', appointmentController.getMyAppointments);

// Create a new appointment
router.post(
  '/',
  [
    check('patient', 'Patient ID is required').not().isEmpty(),
    check('date', 'Valid appointment date is required').isISO8601().toDate(),
    check('duration', 'Duration must be a number').isNumeric(),
    check('type', 'Appointment type is required').isIn(['check-up', 'consultation', 'follow-up', 'initial', 'emergency'])
  ],
  appointmentController.createAppointment
);

// Update an appointment
router.put(
  '/:id',
  [
    check('date', 'Valid appointment date is required').optional().isISO8601().toDate(),
    check('duration', 'Duration must be a number').optional().isNumeric(),
    check('type', 'Appointment type is required').optional().isIn(['check-up', 'consultation', 'follow-up', 'initial', 'emergency']),
    check('status', 'Invalid status').optional().isIn(['confirmed', 'pending', 'cancelled'])
  ],
  appointmentController.updateAppointment
);

// Delete an appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;