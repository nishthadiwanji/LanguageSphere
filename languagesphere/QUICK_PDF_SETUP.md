# Quick PDF Setup Guide

## Set Up Cloud-Hosted PDF URL

### Create `.env` file in `languagesphere` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PDF_URL=https://your-cloud-storage-url.com/path/to/book.pdf
```

### Quick Options for PDF Hosting:

**Option 1: GitHub (Free & Easy)**
1. Upload PDF to a GitHub repository
2. Use raw URL:
   ```env
   REACT_APP_PDF_URL=https://raw.githubusercontent.com/username/repo/main/book.pdf
   ```

**Option 2: AWS S3**
```env
REACT_APP_PDF_URL=https://your-bucket.s3.amazonaws.com/books/book.pdf
```

**Option 3: Google Cloud Storage**
```env
REACT_APP_PDF_URL=https://storage.googleapis.com/your-bucket/books/book.pdf
```

**Option 4: Any HTTPS URL**
```env
REACT_APP_PDF_URL=https://example.com/path/to/book.pdf
```

## For Production

**Set production PDF URL:**
```env
REACT_APP_PDF_URL=https://your-production-pdf-url.com/book.pdf
```

**Set production API URL:**
```env
REACT_APP_API_URL=https://your-backend-api.com/api
```

## Example .env File

```env
# Development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PDF_URL=https://raw.githubusercontent.com/yourusername/repo/main/book.pdf

# Production (set these in your hosting platform)
# REACT_APP_API_URL=https://api.yourdomain.com/api
# REACT_APP_PDF_URL=https://cdn.yourdomain.com/books/book.pdf
```

## Setup Checklist

- [ ] Created `.env` file in `languagesphere` directory
- [ ] Added `REACT_APP_PDF_URL` with your cloud storage PDF URL
- [ ] Restarted React app (`npm start`)
- [ ] PDF loads and displays correctly in the viewer

## Need More Help?

See `PDF_SETUP.md` for detailed instructions on:
- Setting up AWS S3, Google Cloud, Firebase, etc.
- Security best practices
- Signed URLs
- CORS configuration

