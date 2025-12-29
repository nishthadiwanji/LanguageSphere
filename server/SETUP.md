# Backend Server Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set up MongoDB**
   
   Option A: Local MongoDB
   - Install MongoDB on your machine
   - Make sure MongoDB is running: `mongod`
   
   Option B: MongoDB Atlas (Cloud - Recommended)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

3. **Create .env file**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/languagesphere
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/languagesphere?retryWrites=true&w=majority
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify Server is Running**
   - Open http://localhost:5000/api/health in your browser
   - You should see: `{"status":"OK","message":"Server is running"}`

## Troubleshooting

### "Failed to fetch" Error
- Make sure the server is running on port 5000
- Check that MongoDB is running and accessible
- Verify the MONGODB_URI in your .env file is correct

### MongoDB Connection Error
- Check if MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify your connection string is correct
- Make sure your IP is whitelisted in MongoDB Atlas (if using cloud)

### Port Already in Use
- Change the PORT in .env file to a different port (e.g., 5001)
- Update REACT_APP_API_URL in frontend .env to match

