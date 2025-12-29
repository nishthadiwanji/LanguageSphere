# MongoDB Atlas Setup Guide (Quick & Easy)

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (free account)

### 2. Create a Free Cluster
1. After logging in, click "Build a Database"
2. Choose the **FREE** (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster" (takes 1-3 minutes)

### 3. Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `languagesphere`)
5. Enter a strong password (save this!)
6. Set privileges to "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### 4. Whitelist Your IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your current IP: Click "Add Current IP Address"
4. Click "Confirm"

### 5. Get Connection String
1. Go back to "Database" (or "Clusters")
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update Your .env File
1. Open `server/.env` file (create it if it doesn't exist)
2. Replace the connection string with your Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://languagesphere:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/languagesphere?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```
   
   **Important:** 
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster name
   - Add `/languagesphere` before the `?` to specify the database name

### 7. Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Then restart
cd server
npm start
```

You should now see: `MongoDB connected: [your-cluster-name]`

## Example .env File
```env
PORT=5000
MONGODB_URI=mongodb+srv://languagesphere:mypassword123@cluster0.abc123.mongodb.net/languagesphere?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345
```

## Troubleshooting

**Connection Error?**
- Make sure you replaced `<username>` and `<password>` in the connection string
- Verify your IP is whitelisted in Network Access
- Check that the database user password is correct

**Still having issues?**
- Try using the connection string format with your actual credentials
- Make sure there are no extra spaces in the .env file
- Restart your server after updating .env

