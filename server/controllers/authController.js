const { validationResult } = require('express-validator'); // added line
const User = require('../models/User');
const { generateToken } = require('../middleware/auth'); // ✅ Correct



exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, role, age, chronicDisease, assignedDoctor, specialization } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with appropriate role-based fields
    const userData = {
      name,
      email,
      password,
      role: role || 'patient'
    };

    // Add role-specific fields
    if (role === 'patient') {
      userData.age = age;
      userData.chronicDisease = chronicDisease;
      userData.assignedDoctor = assignedDoctor;
    } else if (role === 'doctor') {
      userData.specialization = specialization;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  res.json({ message: 'Login endpoint not yet implemented.' });
};

exports.forgotPassword = async (req, res) => {
  res.json({ message: 'Forgot password endpoint not yet implemented.' });
};

exports.resetPassword = async (req, res) => {
  res.json({ message: 'Reset password endpoint not yet implemented.' });
};

exports.getMe = async (req, res) => {
  res.json({ message: 'Current user endpoint not yet implemented.' });
};

exports.getUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};