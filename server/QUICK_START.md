# Quick Start - Fix MongoDB Connection Error

## The Problem
You're seeing: `MongoDB connection error: connect ECONNREFUSED ::1:27017`

This means MongoDB is not running on your machine.

## Fastest Solution: MongoDB Atlas (5 minutes) ⭐ RECOMMENDED

### Step 1: Create Account & Cluster
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a free M0 cluster
4. Wait 1-3 minutes for cluster to be ready

### Step 2: Setup Database Access
1. Click "Database Access" → "Add New Database User"
2. Username: `languagesphere`
3. Password: Create a strong password (save it!)
4. Privileges: "Atlas admin"
5. Click "Add User"

### Step 3: Whitelist IP
1. Click "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (for development)
3. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string

### Step 5: Create .env File
```bash
cd server
cp .env.example .env
```

Then edit `.env` and replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://languagesphere:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/languagesphere?retryWrites=true&w=majority
```

**Important:** Replace:
- `YOUR_PASSWORD` with your database user password
- `cluster0.xxxxx` with your actual cluster name
- Make sure `/languagesphere` is before the `?`

### Step 6: Restart Server
```bash
# Stop server (Ctrl+C)
npm start
```

You should see: `MongoDB connected: [your-cluster-name]`

---

## Alternative: Install MongoDB Locally

If you prefer local MongoDB:

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Create .env file
cd server
cp .env.example .env
# Edit .env - MONGODB_URI should already be correct for local

# Restart server
npm start
```

See `INSTALL_MONGODB_LOCAL.md` for detailed instructions.

---

## Need Help?

- **MongoDB Atlas Setup**: See `MONGODB_ATLAS_SETUP.md`
- **Local Installation**: See `INSTALL_MONGODB_LOCAL.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`

