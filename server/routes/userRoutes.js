const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Get all users (with optional role filter)
router.get('/', userController.getUsers);

// Update user profile
router.put('/profile', protect, userController.updateProfile);

// Update user password
router.put('/password', protect, userController.updatePassword);

// Update notification settings
router.put('/notifications', protect, userController.updateNotificationSettings);

module.exports = router;