const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes
 */
exports.protect = passport.authenticate('jwt', { session: false });

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

/**
 * Utility to generate a JWT token for a user
 */
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
