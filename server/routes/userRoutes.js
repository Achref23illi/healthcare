const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');


// Update user profile
router.put('/profile', protect, userController.updateProfile);

router.get('/', userController.getUsers);

module.exports = router;