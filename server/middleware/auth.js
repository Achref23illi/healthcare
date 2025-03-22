const passport = require('passport');

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