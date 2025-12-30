# Vercel Deployment Guide - Fixing NOT_FOUND Error

## Problem Summary

The `NOT_FOUND` error on Vercel occurs because Vercel is a **serverless platform** that requires a different architecture than traditional Node.js hosting. Your Express backend needs to be wrapped as a serverless function.

## What Was Wrong

### The Issue
- **Traditional Express Setup**: Your `server/server.js` runs a continuous Express server (designed for Heroku, Railway, VPS)
- **Vercel Expectation**: Vercel needs serverless functions that handle individual requests
- **Missing Configuration**: No `vercel.json` to tell Vercel how to route requests

### Root Cause
Vercel doesn't run a persistent server. Instead:
1. It creates **serverless functions** from files in `/api` directory
2. Each function handles one request and shuts down
3. Without proper configuration, Vercel doesn't know where your API routes are

## The Fix

### Files Created

1. **`vercel.json`** - Tells Vercel:
   - Where to build the frontend (`languagesphere/build`)
   - How to route API requests (`/api/*` → `/api/index.js`)
   - How to serve the React app (SPA routing)

2. **`api/index.js`** - Serverless function wrapper:
   - Imports your Express app
   - Connects to MongoDB (with connection caching for performance)
   - Handles all `/api/*` requests

3. **`package.json`** (root) - Ensures dependencies are available:
   - Makes sure Express and other backend deps are installed
   - Provides build script for Vercel

## Deployment Steps

### 1. Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/languagesphere
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
REACT_APP_API_URL=https://your-vercel-domain.vercel.app/api
```

**Important**: 
- `REACT_APP_API_URL` should point to your Vercel deployment URL
- Don't use `localhost:5000` in production
- The frontend will call `/api/*` which Vercel routes to the serverless function

### 2. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B: Via GitHub Integration**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect the configuration

### 3. Verify Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **API Health**: Visit `https://your-app.vercel.app/api/health`
3. **API Routes**: Test `/api/auth/login`, `/api/payment/status`, etc.

## How It Works Now

### Request Flow

```
User Request → Vercel Edge Network
    ↓
/api/* requests → api/index.js (serverless function)
    ↓
Express app handles route
    ↓
Response sent back
```

### Frontend Requests

Your React app makes requests to:
- Development: `http://localhost:5000/api/*` (local Express server)
- Production: `https://your-app.vercel.app/api/*` (Vercel serverless function)

The `REACT_APP_API_URL` environment variable controls this.

## Key Concepts Explained

### 1. Serverless Functions vs Traditional Servers

**Traditional (Heroku, Railway, VPS)**:
```
Server starts → Listens on port → Handles multiple requests → Stays running
```

**Serverless (Vercel, AWS Lambda)**:
```
Request arrives → Function starts → Handles request → Function stops
```

**Why Serverless?**
- ✅ Auto-scaling (no server management)
- ✅ Pay per request (cost-effective)
- ✅ Global edge network (faster)
- ❌ Cold starts (first request slower)
- ❌ No persistent connections

### 2. Connection Caching

In `api/index.js`, we cache the MongoDB connection:

```javascript
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb; // Reuse existing connection
  }
  // ... create new connection
};
```

**Why?** Each serverless function invocation is isolated. Without caching, every request would create a new database connection (slow and expensive).

### 3. Vercel Routing

The `vercel.json` file tells Vercel:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- `/api/*` → Goes to serverless function
- `/*` → Serves React app (SPA routing)

## Warning Signs to Watch For

### 1. Missing `vercel.json`
- **Symptom**: All API routes return 404
- **Fix**: Create `vercel.json` with proper routing

### 2. Wrong API URL in Frontend
- **Symptom**: CORS errors, "Failed to fetch"
- **Fix**: Set `REACT_APP_API_URL` to your Vercel domain

### 3. Database Connection Issues
- **Symptom**: Slow responses, connection timeouts
- **Fix**: Use connection caching (already implemented)
- **Fix**: Ensure MongoDB Atlas allows Vercel IPs (0.0.0.0/0 for all)

### 4. Missing Environment Variables
- **Symptom**: Authentication fails, database errors
- **Fix**: Set all env vars in Vercel dashboard

### 5. Build Failures
- **Symptom**: Deployment fails at build step
- **Fix**: Check `buildCommand` in `vercel.json` matches your project structure

## Alternative Approaches

### Option 1: Separate Deployments (Recommended for Large Apps)
- **Frontend**: Deploy `languagesphere/` to Vercel
- **Backend**: Deploy `server/` to Railway/Heroku/Render
- **Pros**: Independent scaling, easier debugging
- **Cons**: CORS configuration needed, two deployments

### Option 2: API Routes in Frontend Directory
Instead of `/api/index.js`, create:
- `languagesphere/api/auth.js`
- `languagesphere/api/payment.js`
- **Pros**: Simpler structure
- **Cons**: Mixes frontend/backend code

### Option 3: Next.js Migration (Future)
- Convert React app to Next.js
- Use Next.js API routes (`pages/api/`)
- **Pros**: Built-in serverless functions, better DX
- **Cons**: Requires refactoring

## Troubleshooting

### Issue: Still Getting NOT_FOUND
1. Check `vercel.json` exists in root directory
2. Verify `api/index.js` exists
3. Check Vercel deployment logs for errors
4. Ensure all dependencies are in root `package.json`

### Issue: API Routes Work But Frontend Doesn't
1. Check `outputDirectory` in `vercel.json`
2. Verify React build succeeds (`npm run build` in `languagesphere/`)
3. Check browser console for routing errors

### Issue: Database Connection Fails
1. Verify `MONGODB_URI` is set in Vercel
2. Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
3. Check connection string format

### Issue: Slow API Responses
1. This is normal for cold starts (first request after inactivity)
2. Consider using Vercel Pro for better performance
3. Implement connection pooling (already done)

## Testing Locally

To test the Vercel setup locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run Vercel dev server
vercel dev
```

This simulates the Vercel environment locally.

## Summary

The NOT_FOUND error was caused by:
1. **Missing serverless function wrapper** - Express app wasn't accessible to Vercel
2. **No routing configuration** - Vercel didn't know how to route `/api/*` requests
3. **Architecture mismatch** - Traditional server vs serverless platform

The fix:
1. Created `api/index.js` serverless function wrapper
2. Created `vercel.json` routing configuration
3. Added root `package.json` for dependency management

Now your app works on Vercel's serverless platform! 🎉

