const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional authentication middleware - doesn't fail if no token provided
// This allows routes to work for both authenticated and non-authenticated users
const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      // No token provided - continue without user
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Find user by id from token
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      // Add user to request object if token is valid
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Token invalid or expired - continue without user
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;
