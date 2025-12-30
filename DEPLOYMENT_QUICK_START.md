# 🚀 Quick Start: Deploy to Vercel in 5 Minutes

## Prerequisites Checklist
- [ ] Vercel account created
- [ ] Code pushed to GitHub/GitLab
- [ ] MongoDB Atlas database ready
- [ ] Environment variables list ready

---

## Step 1: Push to GitHub (2 min)

```bash
cd /Users/nishthadiwanji/Desktop/LanguageSphere/LanguageSphere
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Import to Vercel (1 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your repository
4. Click **"Deploy"** (we'll add env vars next)

---

## Step 3: Add Environment Variables (2 min)

In Vercel Dashboard → **Settings** → **Environment Variables**, add:

```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/languagesphere
JWT_SECRET = your-secret-key-min-32-characters
NODE_ENV = production
REACT_APP_API_URL = https://your-app-name.vercel.app/api
```

**Note**: For `REACT_APP_API_URL`, use the URL Vercel gives you after first deployment, then redeploy.

---

## Step 4: Redeploy (1 min)

After adding environment variables:
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

---

## Step 5: Test (1 min)

1. Visit your site: `https://your-app-name.vercel.app`
2. Test API: `https://your-app-name.vercel.app/api/health`
3. Try login/signup

---

## ✅ Done!

Your site is live! For detailed instructions, see `VERCEL_DEPLOYMENT_STEP_BY_STEP.md`

