# Step-by-Step Vercel Deployment Guide for LanguageSphere

This guide will walk you through deploying your entire LanguageSphere website (frontend + backend) to Vercel.

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Node.js and npm installed on your local machine
- ✅ MongoDB Atlas account with a database cluster (or local MongoDB)
- ✅ Git repository (GitHub, GitLab, or Bitbucket) - **Recommended**
- ✅ All your code committed and pushed to your repository

---

## 🚀 Step 1: Prepare Your Project

### 1.1 Verify Project Structure

Your project should have this structure:
```
LanguageSphere/
├── api/
│   └── index.js          # Serverless function wrapper
├── languagesphere/       # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── server/               # Express backend routes
│   └── routes/
├── vercel.json          # Vercel configuration
└── package.json         # Root package.json
```

### 1.2 Test Build Locally (Optional but Recommended)

```bash
# Navigate to your project root
cd /Users/nishthadiwanji/Desktop/LanguageSphere/LanguageSphere

# Test the frontend build
cd languagesphere
npm install
npm run build

# If build succeeds, you're good to go!
# Go back to root
cd ..
```

---

## 🔐 Step 2: Set Up Environment Variables

You'll need to set these environment variables in Vercel. **Do this BEFORE deploying** to avoid errors.

### 2.1 Required Environment Variables

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/languagesphere` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-min-32-chars` |
| `NODE_ENV` | Environment mode | `production` |
| `REACT_APP_API_URL` | Frontend API URL | `https://your-app.vercel.app/api` |

### 2.2 How to Set Environment Variables

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Create a new project (or select existing)
3. Go to **Project Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select `Production`, `Preview`, and `Development`
   - Click **Save**
5. Repeat for all variables

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add REACT_APP_API_URL
```

**⚠️ Important Notes:**
- `REACT_APP_API_URL` should be set to your Vercel deployment URL (you'll get this after first deployment)
- For the first deployment, you can use a placeholder like `https://your-app-name.vercel.app/api`
- After deployment, update it with the actual URL
- Make sure MongoDB Atlas allows connections from anywhere (IP: `0.0.0.0/0`) or add Vercel's IP ranges

---

## 📦 Step 3: Deploy to Vercel

You have two options: **GitHub Integration** (Recommended) or **Vercel CLI**.

### Option A: Deploy via GitHub Integration (Recommended)

#### 3.1 Push Code to GitHub

```bash
# Make sure you're in the project root
cd /Users/nishthadiwanji/Desktop/LanguageSphere/LanguageSphere

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Create a repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

#### 3.2 Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will auto-detect your configuration:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd languagesphere && npm install && npm run build` (auto-detected from vercel.json)
   - **Output Directory**: `languagesphere/build` (auto-detected from vercel.json)
6. **Add Environment Variables** (if you haven't already):
   - Click **"Environment Variables"**
   - Add all variables from Step 2
7. Click **"Deploy"**

#### 3.3 Wait for Deployment

- Vercel will:
  1. Install dependencies
  2. Build your React app
  3. Deploy everything
- This takes 2-5 minutes
- You'll see build logs in real-time

#### 3.4 Get Your Deployment URL

After deployment completes:
- You'll get a URL like: `https://your-app-name.vercel.app`
- **Save this URL!** You'll need it for `REACT_APP_API_URL`

#### 3.5 Update REACT_APP_API_URL

1. Go to **Project Settings** → **Environment Variables**
2. Find `REACT_APP_API_URL`
3. Update it to: `https://your-actual-app-name.vercel.app/api`
4. **Redeploy** (Vercel will auto-redeploy if you have GitHub integration, or click "Redeploy")

---

### Option B: Deploy via Vercel CLI

#### 3.1 Install Vercel CLI

```bash
npm i -g vercel
```

#### 3.2 Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

#### 3.3 Deploy

```bash
# Navigate to project root
cd /Users/nishthadiwanji/Desktop/LanguageSphere/LanguageSphere

# Deploy (first time will ask questions)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No (first time)
# - Project name? languagesphere (or your choice)
# - Directory? ./
# - Override settings? No (use vercel.json)
```

#### 3.4 Set Environment Variables (if not done via dashboard)

```bash
# Set each variable
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
vercel env add REACT_APP_API_URL production

# After first deployment, update REACT_APP_API_URL with actual URL
```

#### 3.5 Deploy to Production

```bash
# Deploy to production (not preview)
vercel --prod
```

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Frontend

1. Visit your deployment URL: `https://your-app-name.vercel.app`
2. You should see your homepage
3. Check browser console for errors

### 4.2 Test API Health Endpoint

Visit: `https://your-app-name.vercel.app/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4.3 Test Authentication

1. Go to `/login` page
2. Try to sign up or log in
3. Check if API calls work (open browser DevTools → Network tab)

### 4.4 Test API Routes

Test these endpoints:
- `GET /api/health` - Should return OK
- `POST /api/auth/register` - Should create user
- `POST /api/auth/login` - Should return token
- `GET /api/auth/me` - Should return user (with auth token)

---

## 🔧 Step 5: Post-Deployment Configuration

### 5.1 Update CORS (if needed)

If you have CORS issues, check `api/index.js`:
```javascript
app.use(cors()); // Should allow all origins in production
```

### 5.2 Configure MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Or add Vercel's IP ranges (less secure but more restrictive)

### 5.3 Set Up Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `REACT_APP_API_URL` to use custom domain

---

## 🐛 Step 6: Troubleshooting

### Issue: Build Fails

**Symptoms**: Deployment fails at build step

**Solutions**:
1. Check build logs in Vercel dashboard
2. Test build locally: `cd languagesphere && npm run build`
3. Ensure all dependencies are in `languagesphere/package.json`
4. Check Node.js version compatibility

### Issue: API Returns 404

**Symptoms**: `/api/*` routes return 404

**Solutions**:
1. Verify `vercel.json` exists in root
2. Check `api/index.js` exists
3. Verify rewrites in `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/index.js" }
     ]
   }
   ```
4. Check Vercel function logs

### Issue: Database Connection Fails

**Symptoms**: API returns 500 errors, database connection errors

**Solutions**:
1. Verify `MONGODB_URI` is set correctly in Vercel
2. Check MongoDB Atlas network access (allow `0.0.0.0/0`)
3. Verify connection string format
4. Check Vercel function logs for specific error

### Issue: Frontend Can't Connect to API

**Symptoms**: CORS errors, "Failed to fetch"

**Solutions**:
1. Verify `REACT_APP_API_URL` is set to: `https://your-app.vercel.app/api`
2. Check browser console for exact error
3. Ensure API routes are working (test `/api/health`)
4. Check CORS configuration in `api/index.js`

### Issue: Environment Variables Not Working

**Symptoms**: Variables are undefined, app behaves differently

**Solutions**:
1. **Redeploy** after adding environment variables (they're only available on new deployments)
2. Verify variables are set for correct environment (Production/Preview/Development)
3. For React variables, they must start with `REACT_APP_`
4. Check variable names match exactly (case-sensitive)

### Issue: Slow API Responses

**Symptoms**: First request is slow, subsequent requests are faster

**Explanation**: This is normal! It's called a "cold start"
- First request after inactivity: ~1-3 seconds (function starts)
- Subsequent requests: <100ms (function is "warm")

**Solutions**:
1. This is expected behavior for serverless
2. Consider Vercel Pro plan for better performance
3. Use connection caching (already implemented in `api/index.js`)

---

## 📝 Step 7: Continuous Deployment

Once set up with GitHub integration:

✅ **Automatic Deployments**:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

✅ **No Manual Steps Needed**:
- Just push code to GitHub
- Vercel automatically builds and deploys

---

## 🎯 Quick Reference Checklist

Before deploying:
- [ ] Code is pushed to GitHub/GitLab
- [ ] `vercel.json` exists in root
- [ ] `api/index.js` exists
- [ ] Frontend builds successfully locally
- [ ] MongoDB Atlas is set up
- [ ] Environment variables are ready

During deployment:
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Build completes successfully
- [ ] Deployment URL obtained

After deployment:
- [ ] Frontend loads correctly
- [ ] `/api/health` returns OK
- [ ] Authentication works
- [ ] `REACT_APP_API_URL` updated with actual URL
- [ ] All features tested

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Test changes on preview URLs before merging to main
2. **Monitor Function Logs**: Check Vercel dashboard → Functions → Logs for debugging
3. **Set Up Alerts**: Configure Vercel notifications for failed deployments
4. **Use Environment-Specific Variables**: Different values for Production vs Preview
5. **Optimize Build Time**: Use `.vercelignore` to exclude unnecessary files

---

## 🎉 Success!

If everything works:
- ✅ Your frontend is live at `https://your-app.vercel.app`
- ✅ Your API is accessible at `https://your-app.vercel.app/api/*`
- ✅ Automatic deployments are set up
- ✅ Your website is globally distributed via Vercel's edge network

**Congratulations! Your LanguageSphere website is now live! 🚀**

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Test API endpoints directly
4. Review this guide's troubleshooting section
5. Check Vercel documentation

