# Install MongoDB Locally (macOS)

## Using Homebrew (Recommended)

### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### 3. Start MongoDB
```bash
brew services start mongodb-community
```

### 4. Verify MongoDB is Running
```bash
brew services list | grep mongodb
# Should show: mongodb-community started
```

### 5. Test Connection
```bash
mongosh
# Should connect to MongoDB shell
```

### 6. Create .env File
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/languagesphere
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 7. Restart Your Server
```bash
cd server
npm start
```

## Manual Start (Alternative)
If you don't want MongoDB as a service:
```bash
mongod --config /usr/local/etc/mongod.conf
```

## Stop MongoDB
```bash
brew services stop mongodb-community
```

## Troubleshooting
- **Permission errors**: Make sure you have write access to `/usr/local/var/mongodb`
- **Port already in use**: Check if MongoDB is already running: `lsof -i :27017`

