// Vercel serverless function wrapper for Express app
// This file allows the Express backend to run as a serverless function on Vercel

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import routes - paths are relative to this file location
const authRoutes = require('../server/routes/auth');
const paymentRoutes = require('../server/routes/payment');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (cached for serverless)
let cachedDb = null;

const connectDB = async () => {
  // Check if connection is already established and ready
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Routes - mount at /api since Vercel already routes /api/* to this function
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Connect to database before handling request
  // Cache the connection across invocations for better performance
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    // For health check, we can still respond without DB
    if (req.url === '/api/health') {
      return res.status(503).json({ 
        status: 'ERROR', 
        message: 'Database connection failed',
        error: error.message 
      });
    }
    // For other routes, let Express handle the error
  }

  // Handle the request with Express
  // Vercel passes the full request path, so Express routing should work correctly
  return app(req, res);
};

