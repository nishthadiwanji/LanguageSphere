# PDF Setup Guide

## Setting Up Cloud-Hosted PDF

The PDF viewer supports cloud-hosted PDFs from various storage services. Here's how to set it up:

### Option 1: AWS S3 (Recommended for Production)

1. **Upload PDF to S3:**
   ```bash
   aws s3 cp your-book.pdf s3://your-bucket-name/books/languagesphere-book.pdf
   ```

2. **Make the file publicly readable:**
   - Go to S3 Console → Your bucket → Select file
   - Click "Permissions" → "Edit"
   - Add public read access (or use signed URLs for security)

3. **Get the URL:**
   ```
   https://your-bucket-name.s3.amazonaws.com/books/languagesphere-book.pdf
   ```
   Or with region:
   ```
   https://your-bucket-name.s3.region.amazonaws.com/books/languagesphere-book.pdf
   ```

4. **Set in .env:**
   ```env
   REACT_APP_PDF_URL=https://your-bucket-name.s3.amazonaws.com/books/languagesphere-book.pdf
   ```

### Option 2: Google Cloud Storage

1. **Upload PDF to GCS:**
   ```bash
   gsutil cp your-book.pdf gs://your-bucket-name/books/languagesphere-book.pdf
   ```

2. **Make publicly accessible:**
   ```bash
   gsutil acl ch -u AllUsers:R gs://your-bucket-name/books/languagesphere-book.pdf
   ```

3. **Get the URL:**
   ```
   https://storage.googleapis.com/your-bucket-name/books/languagesphere-book.pdf
   ```

4. **Set in .env:**
   ```env
   REACT_APP_PDF_URL=https://storage.googleapis.com/your-bucket-name/books/languagesphere-book.pdf
   ```

### Option 3: Firebase Storage

1. **Upload PDF to Firebase Storage**
2. **Get download URL** from Firebase Console
3. **Set in .env:**
   ```env
   REACT_APP_PDF_URL=https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/books%2Fbook.pdf?alt=media&token=...
   ```

### Option 4: Cloudinary

1. **Upload PDF to Cloudinary**
2. **Get the URL:**
   ```
   https://res.cloudinary.com/your-cloud-name/raw/upload/v1234567890/books/languagesphere-book.pdf
   ```

3. **Set in .env:**
   ```env
   REACT_APP_PDF_URL=https://res.cloudinary.com/your-cloud-name/raw/upload/v1234567890/books/languagesphere-book.pdf
   ```

### Option 5: GitHub (Free, Simple)

1. **Create a repository** (can be private)
2. **Upload PDF** to the repository
3. **Use GitHub Raw URL:**
   ```
   https://raw.githubusercontent.com/username/repo-name/branch/path/to/book.pdf
   ```

4. **Set in .env:**
   ```env
   REACT_APP_PDF_URL=https://raw.githubusercontent.com/username/repo-name/main/books/languagesphere-book.pdf
   ```

### Option 6: Direct URL (Any HTTPS URL)

You can use any publicly accessible HTTPS URL:
```env
REACT_APP_PDF_URL=https://example.com/path/to/your-book.pdf
```

## Environment Variable Setup

### For Development

Create `.env` file in `languagesphere` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PDF_URL=https://your-cloud-storage-url.com/path/to/book.pdf
```

### For Production

Set environment variables in your hosting platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `REACT_APP_PDF_URL`

**Netlify:**
- Go to Site Settings → Environment Variables
- Add `REACT_APP_PDF_URL`

**Heroku:**
```bash
heroku config:set REACT_APP_PDF_URL=https://your-url.com/book.pdf
```

## Testing Payment Flow

### Manual Database Update (For Testing)

If you want to test with actual payment status:

1. **Using MongoDB:**
   ```javascript
   // In MongoDB shell or Compass
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { "payments.book.paid": true } }
   )
   ```

2. **Or use the backend API** (if you add an admin endpoint):
   ```bash
   curl -X POST http://localhost:5000/api/payment/verify \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"paymentId": "test-payment-123", "option": "book"}'
   ```


## Security Best Practices

1. **Use Signed URLs** (for AWS S3, GCS):
   - Generate time-limited signed URLs
   - Implement backend endpoint to generate URLs
   - Only provide signed URLs to authenticated, paid users

2. **Restrict Access:**
   - Don't make PDFs publicly accessible
   - Use authentication tokens
   - Implement IP whitelisting if possible

3. **CDN with Access Control:**
   - Use CloudFront (AWS) or Cloud CDN (GCP)
   - Implement signed URLs or origin access control

## Example: Secure PDF Access with Backend

Instead of direct URL, create a backend endpoint:

```javascript
// server/routes/payment.js
router.get('/pdf-url', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (!user?.payments?.book?.paid) {
    return res.status(403).json({ message: 'Payment required' });
  }
  
  // Generate signed URL (AWS S3 example)
  const signedUrl = s3.getSignedUrl('getObject', {
    Bucket: 'your-bucket',
    Key: 'books/languagesphere-book.pdf',
    Expires: 3600 // 1 hour
  });
  
  res.json({ pdfUrl: signedUrl });
});
```

Then in frontend:
```typescript
const [pdfUrl, setPdfUrl] = useState('');

useEffect(() => {
  if (user?.payments?.book?.paid) {
    fetch(`${API_URL}/payment/pdf-url`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setPdfUrl(data.pdfUrl));
  }
}, [user]);
```

## Troubleshooting

**PDF not loading?**
- Check CORS settings on your storage service
- Verify the URL is publicly accessible
- Check browser console for errors
- Try opening the URL directly in browser

**CORS errors?**
- Configure CORS on your storage bucket
- For S3: Add CORS configuration
- For GCS: Set CORS policy

**PDF loads but viewer doesn't work?**
- The viewer uses Google Docs Viewer as fallback
- Some PDFs may need to be optimized
- Try different PDF hosting service

