const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'spacECE_Task_Management_Secret_JWT_Key_2026');

      // Get user from the token, exclude password
      if (global.useMockDB) {
        const mockDb = require('../config/mockDb');
        req.user = await mockDb.findUserById(decoded.id);
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
