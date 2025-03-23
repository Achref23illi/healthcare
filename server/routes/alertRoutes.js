// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get all alerts
router.get('/', alertController.getAlerts);

// Create a custom alert
router.post('/', alertController.createAlert);

// Update alert status
router.put('/:id', alertController.updateAlertStatus);

module.exports = router;