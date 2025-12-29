# Secure PDF Setup Guide

## ⚠️ Important: Security Notice

**DO NOT use public URLs (GitHub, public S3 buckets, etc.) for your PDF!**

If you use a public URL, anyone with the link can access your PDF without payment, defeating the entire purpose of payment protection.

## How It Works Now

The PDF URL is now stored **securely on your server** and only provided to authenticated users who have paid:

1. User makes payment
2. Payment is verified on backend
3. User requests PDF URL from backend
4. Backend verifies payment status
5. Backend returns PDF URL (only if paid)
6. Frontend displays PDF

## Setup Instructions

### Step 1: Store PDF Securely

You have several secure options:

#### Option A: Private Cloud Storage (Recommended)

**AWS S3 (Private Bucket):**
1. Upload PDF to S3 bucket
2. Keep bucket **PRIVATE** (not public)
3. Set up IAM user with read-only access
4. Use AWS SDK to generate signed URLs

**Google Cloud Storage (Private):**
1. Upload PDF to GCS bucket
2. Keep bucket **PRIVATE**
3. Use service account to generate signed URLs

**Firebase Storage (Private):**
1. Upload PDF to Firebase Storage
2. Set security rules to deny public access
3. Use Firebase Admin SDK to generate download URLs

#### Option B: Store on Server

1. Upload PDF to your server (e.g., `server/uploads/book.pdf`)
2. Serve via protected endpoint
3. Verify payment before serving

### Step 2: Configure Backend

Add PDF URL to your **server** `.env` file (NOT frontend):

```env
# In server/.env
PDF_URL=https://your-private-storage-url.com/book.pdf
# OR for server-stored files:
PDF_URL=/path/to/server/uploads/book.pdf
```

**Important:** 
- This URL should NOT be publicly accessible
- Only your server should know this URL
- Never expose this in frontend code or environment variables

### Step 3: Implement Signed URLs (For Cloud Storage)

For maximum security with cloud storage, use signed URLs:

#### AWS S3 Example:

```javascript
// server/routes/payment.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.get('/pdf-url', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.payments?.book?.paid) {
      return res.status(403).json({ message: 'Payment required' });
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'books/languagesphere-book.pdf',
      Expires: 3600, // 1 hour
    });

    res.json({ pdfUrl: signedUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

#### Google Cloud Storage Example:

```javascript
// server/routes/payment.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: process.env.GCS_KEY_FILE,
  projectId: process.env.GCS_PROJECT_ID,
});

router.get('/pdf-url', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.payments?.book?.paid) {
      return res.status(403).json({ message: 'Payment required' });
    }

    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
    const file = bucket.file('books/languagesphere-book.pdf');
    
    // Generate signed URL (valid for 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600 * 1000, // 1 hour
    });

    res.json({ pdfUrl: signedUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

### Step 4: Server-Side PDF Serving (Alternative)

If storing PDF on your server:

```javascript
// server/routes/payment.js
const path = require('path');
const fs = require('fs');

router.get('/pdf', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.payments?.book?.paid) {
      return res.status(403).json({ message: 'Payment required' });
    }

    const pdfPath = path.join(__dirname, '../uploads/book.pdf');
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Set headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');
    
    // Stream the PDF
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

Then update frontend to use:
```typescript
const pdfUrl = `${API_URL}/payment/pdf`;
```

## Security Checklist

- [ ] PDF is stored in **private** storage (not publicly accessible)
- [ ] PDF URL is stored on **server** only (not in frontend)
- [ ] Backend verifies payment before returning URL
- [ ] Using signed URLs (time-limited) for cloud storage
- [ ] PDF URL expires after reasonable time (1 hour recommended)
- [ ] Server validates user authentication
- [ ] Server validates payment status
- [ ] No PDF URL in frontend code or environment variables

## What NOT to Do

❌ **Don't use public GitHub URLs** - Anyone can access
❌ **Don't use public S3 buckets** - Anyone can access
❌ **Don't put PDF URL in frontend .env** - Can be exposed
❌ **Don't hardcode PDF URLs** - Security risk
❌ **Don't use permanent URLs** - Use time-limited signed URLs

## Testing

1. Try accessing PDF without payment - should fail
2. Make payment
3. Try accessing PDF - should work
4. Try accessing PDF URL directly - should require authentication
5. Wait for signed URL to expire - should fail after expiration

## Production Recommendations

1. **Use signed URLs** with short expiration (1 hour)
2. **Store PDF in private cloud storage** (AWS S3, GCS, etc.)
3. **Implement rate limiting** on PDF endpoint
4. **Log PDF access** for monitoring
5. **Use HTTPS** for all connections
6. **Implement CORS** restrictions if needed
7. **Add watermarking** to PDFs (optional)

