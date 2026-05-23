const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'spacECE_Task_Management_Secret_JWT_Key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    let user;
    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      // Check if user exists
      const userExists = await mockDb.findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      // Create user
      user = await mockDb.createUser({ name, email, password });
    } else {
      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      // Create user
      user = await User.create({
        name,
        email,
        password,
      });
    }

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id || user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id || user.id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user;
    let isMatch = false;

    if (global.useMockDB) {
      const mockDb = require('../config/mockDb');
      const bcrypt = require('bcryptjs');
      
      // Check for user email
      user = await mockDb.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      // Check password matches
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Check for user email
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      // Check password matches
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id || user.id),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user details' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
