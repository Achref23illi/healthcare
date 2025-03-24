// Modified routes/patientsRoutes.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Route for getting the patient's doctor (must come before the :id route)
router.get('/my-doctor', patientController.getMyDoctor);

// Get all patients
router.get('/', patientController.getPatients);

// Add a new patient
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('age', 'Age must be a number').isNumeric()
  ],
  patientController.addPatient
);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

// Update patient
router.put('/:id', patientController.updatePatient);

// Delete patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;