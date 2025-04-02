// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get dashboard stats
router.get('/dashboard', analyticsController.getDashboardStats);

// Get patient trends
router.get('/patient-trends', analyticsController.getPatientTrends);

// Get vital signs statistics
router.get('/vital-stats', analyticsController.getVitalSignsStats);

// Get appointment statistics
router.get('/appointment-stats', analyticsController.getAppointmentStats);

module.exports = router;