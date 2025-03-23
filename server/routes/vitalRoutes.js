// routes/vitalRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const vitalSignController = require('../controllers/vitalSignController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Add a vital sign for a patient
router.post(
  '/:patientId',
  [
    check('type', 'Type is required').not().isEmpty(),
    check('value', 'Value is required').not().isEmpty(),
    check('unit', 'Unit is required').not().isEmpty()
  ],
  vitalSignController.addVitalSign
);

// Get vital signs for a patient
router.get('/:patientId', vitalSignController.getVitalSigns);

module.exports = router;