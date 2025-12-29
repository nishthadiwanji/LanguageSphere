const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ name, email, password });
    
    // Validate user before saving
    try {
      await user.save();
    } catch (saveError) {
      // Handle duplicate email error
      if (saveError.code === 11000) {
        return res.status(400).json({ 
          message: 'User already exists with this email'
        });
      }
      throw saveError; // Re-throw other errors
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        payments: user.payments,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        error: 'Duplicate email'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        error: error.message
      });
    }
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Server error during registration' 
      : error.message || 'Server error during registration';
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.name || 'Unknown error'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        payments: user.payments,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        payments: user.payments,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;

