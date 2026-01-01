const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token (supports both header and query parameter for PDF viewing)
const verifyToken = (req, res, next) => {
  // Check Authorization header first, then query parameter
  let token = req.headers.authorization?.split(' ')[1];
  
  // For PDF viewing in iframes, also check query parameter
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
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

// Serve PDF file directly (protected route)
router.get('/pdf', verifyToken, async (req, res) => {
  let fileStream = null;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TEST MODE: Allow access without payment (DEVELOPMENT ONLY - REMOVE IN PRODUCTION)
    const isTestMode = process.env.TEST_MODE === 'true' && process.env.NODE_ENV !== 'production';
    
    // Check if user has paid for the book (unless in test mode)
    if (!isTestMode && !user.payments?.book?.paid) {
      return res.status(403).json({ message: 'Payment required to access PDF' });
    }

    // Path to PDF file - try multiple locations for different environments
    // For Vercel: PDF is in api/ directory (bundled with serverless function)
    // For local: PDF is in server/uploads/ directory
    
    // Get the root directory (where package.json is)
    const rootDir = path.resolve(__dirname, '../..');
    const currentDir = process.cwd();
    
    // Try multiple possible paths
    const possiblePaths = [
      // Vercel: api/ directory at project root
      path.join(rootDir, 'api', 'LanguageSphereBook.pdf'),
      // Alternative: from current working directory
      path.join(currentDir, 'api', 'LanguageSphereBook.pdf'),
      // Local development: server/uploads/
      path.join(__dirname, '../uploads/LanguageSphereBook.pdf'),
      // Alternative: api/ relative to server/routes
      path.join(__dirname, '../../api/LanguageSphereBook.pdf'),
      // Root directory fallback
      path.join(rootDir, 'LanguageSphereBook.pdf'),
    ];
    
    let pdfPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        pdfPath = testPath;
        console.log(`PDF found at: ${pdfPath}`);
        break;
      }
    }
    
    // Check if file exists
    if (!pdfPath || !fs.existsSync(pdfPath)) {
      console.error(`PDF file not found. Tried paths:`);
      possiblePaths.forEach((p, i) => {
        console.error(`  ${i + 1}. ${p} (exists: ${fs.existsSync(p)})`);
      });
      console.error(`  __dirname: ${__dirname}`);
      console.error(`  process.cwd(): ${process.cwd()}`);
      console.error(`  rootDir: ${rootDir}`);
      return res.status(404).json({ 
        message: 'PDF file not found on server',
        error: 'Please ensure PDF file is deployed with the application'
      });
    }
    
    console.log(`Serving PDF from: ${pdfPath}`);

    // Set headers for PDF viewing (inline means view in browser, not download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="LanguageSphereBook.pdf"');
    res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Allow iframe/object embedding - don't set X-Frame-Options to allow embedding
    // CORS is handled by the cors() middleware in server.js
    
    // Stream the PDF file with proper error handling
    fileStream = fs.createReadStream(pdfPath);
    
    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error('PDF stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error reading PDF file' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      if (fileStream) {
        fileStream.destroy();
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('PDF serving error:', error);
    if (fileStream) {
      fileStream.destroy();
    }
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error while serving PDF' });
    }
  }
});

// Get secure PDF URL (only if payment is verified)
router.get('/pdf-url', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TEST MODE: Allow access without payment (DEVELOPMENT ONLY - REMOVE IN PRODUCTION)
    const isTestMode = process.env.TEST_MODE === 'true' && process.env.NODE_ENV !== 'production';
    
    // Check if user has paid for the book (unless in test mode)
    if (!isTestMode && !user.payments?.book?.paid) {
      return res.status(403).json({ 
        message: 'Payment required to access PDF',
        paid: false 
      });
    }

    // Get PDF URL from environment variable, or use the server route
    const envPdfUrl = process.env.PDF_URL || process.env.REACT_APP_PDF_URL;
    
    // Validate that the environment URL is a proper HTTP/HTTPS URL (not a file path)
    const isValidUrl = envPdfUrl && (envPdfUrl.startsWith('http://') || envPdfUrl.startsWith('https://'));
    
    // If no valid external URL is configured, use the server route
    // Construct the full URL based on the request
    let baseUrl = isValidUrl ? envPdfUrl : `${req.protocol}://${req.get('host')}/api/payment/pdf`;
    
    // If using server route, append token as query parameter for iframe authentication
    if (!isValidUrl) {
      const token = req.headers.authorization?.split(' ')[1] || req.query.token;
      if (token) {
        baseUrl += `?token=${token}`;
      }
    }
    
    res.json({
      pdfUrl: baseUrl,
      expiresIn: 3600, // URL valid for 1 hour (if using signed URLs)
    });
  } catch (error) {
    console.error('PDF URL error:', error);
    res.status(500).json({ message: 'Server error while generating PDF URL' });
  }
});

module.exports = router;

