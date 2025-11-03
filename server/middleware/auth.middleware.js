const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized : Token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized : No token');
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden: ${req.user.role} not allowed!!!`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };