const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Verify payment
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { paymentId, option } = req.body; // option: 'course' or 'book'
    
    if (!paymentId || !option) {
      return res.status(400).json({ message: 'Payment ID and option are required' });
    }

    // In production, verify paymentId with Razorpay/PayPal API
    // For now, we'll mark as paid if paymentId is provided
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update payment status
    user.payments[option] = {
      paid: true,
      paymentDate: new Date(),
      paymentId: paymentId,
    };

    await user.save();

    res.json({
      message: 'Payment verified successfully',
      payments: user.payments,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
});

// Check payment status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      payments: user.payments,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get secure PDF URL (only if payment is verified)
router.get('/pdf-url', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TEST MODE: Allow access without payment (DEVELOPMENT ONLY)
    const isTestMode = process.env.TEST_MODE === 'true';
    
    // Check if user has paid for the book (unless in test mode)
    if (!isTestMode && !user.payments?.book?.paid) {
      return res.status(403).json({ 
        message: 'Payment required to access PDF',
        paid: false 
      });
    }

    // Get PDF URL from environment variable (stored securely on server)
    const pdfUrl = process.env.PDF_URL || process.env.REACT_APP_PDF_URL;
    
    if (!pdfUrl) {
      return res.status(500).json({ 
        message: 'PDF URL not configured on server' 
      });
    }

    // Option 1: Return direct URL (if using signed URLs or private storage)
    // Option 2: Generate signed URL for cloud storage (AWS S3, GCS, etc.)
    // Option 3: Return server endpoint that proxies the PDF
    
    // For now, return the URL (in production, use signed URLs for security)
    res.json({
      pdfUrl: pdfUrl,
      expiresIn: 3600, // URL valid for 1 hour (if using signed URLs)
    });
  } catch (error) {
    console.error('PDF URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve PDF file directly (protected route)
router.get('/pdf', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TEST MODE: Allow access without payment (DEVELOPMENT ONLY)
    const isTestMode = process.env.TEST_MODE === 'true';
    
    // Check if user has paid for the book (unless in test mode)
    if (!isTestMode && !user.payments?.book?.paid) {
      return res.status(403).json({ message: 'Payment required to access PDF' });
    }

    const path = require('path');
    const fs = require('fs');
    
    // Path to PDF file (adjust based on your setup)
    const pdfPath = process.env.PDF_PATH || path.join(__dirname, '../uploads/LanguageSphereBook.pdf');
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF file not found on server' });
    }

    // Set headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="LanguageSphereBook.pdf"');
    
    // Add cache control headers
    res.setHeader('Cache-Control', 'private, max-age=3600');
    
    // Stream the PDF
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error serving PDF' });
      }
    });
  } catch (error) {
    console.error('PDF serving error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

