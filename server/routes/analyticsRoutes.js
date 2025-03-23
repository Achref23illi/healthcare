// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get dashboard stats
router.get('/dashboard', analyticsController.getDashboardStats);

module.exports = router;