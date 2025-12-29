# Troubleshooting Guide

## "Server error during registration"

This error can occur for several reasons. Check the following:

### 1. Check MongoDB Connection

**Check if MongoDB is running:**
```bash
# For local MongoDB
mongod --version

# Check if MongoDB service is running
# On Mac:
brew services list | grep mongodb

# On Linux:
sudo systemctl status mongod
```

**Check server console logs:**
- Look for "MongoDB connected" message
- If you see "MongoDB connection error", MongoDB is not running or connection string is wrong

### 2. Verify MongoDB Connection String

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/languagesphere
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/languagesphere?retryWrites=true&w=majority
```

**Common issues:**
- Wrong password in connection string
- IP address not whitelisted in MongoDB Atlas
- Network connectivity issues

### 3. Check Server Logs

When you try to register, check your server console for detailed error messages:
- Look for "Registration error:" followed by the actual error
- Common errors:
  - `MongoServerError: E11000 duplicate key error` - Email already exists
  - `MongooseError: Operation timed out` - MongoDB not accessible
  - `ValidationError` - Invalid data format

### 4. Test MongoDB Connection

**Test if MongoDB is accessible:**
```bash
# For local MongoDB
mongo mongodb://localhost:27017/languagesphere

# Or use mongosh (newer MongoDB client)
mongosh mongodb://localhost:27017/languagesphere
```

### 5. Check Environment Variables

Make sure your `.env` file exists in the `server` directory and contains:
```env
PORT=5000
MONGODB_URI=your_connection_string_here
JWT_SECRET=your-secret-key
```

### 6. Common Solutions

**Solution 1: Start MongoDB**
```bash
# Mac (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Solution 2: Use MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `.env` file

**Solution 3: Check Dependencies**
```bash
cd server
npm install
```

**Solution 4: Restart Server**
```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

### 7. Debug Mode

To see more detailed errors, the server now logs:
- Full error messages in console
- MongoDB connection status
- Registration attempt details

Check your terminal where the server is running for these logs.

