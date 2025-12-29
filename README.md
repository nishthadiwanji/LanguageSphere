# Language Sphere - Full Stack Application

A comprehensive French teaching business platform with authentication, payment processing, and PDF viewing capabilities.

## Features

- **User Authentication**: Login and Signup with JWT tokens
- **Payment Processing**: Secure payment verification for courses and book PDFs
- **PDF Viewer**: View-only PDF access (no downloads) after payment
- **Course Details**: Detailed course structure and pricing information
- **Responsive Design**: Material UI components with mobile support

## Project Structure

```
LanguageSphere/
├── languagesphere/          # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   └── App.tsx         # Main app component
│   └── package.json
└── server/                  # Node.js backend
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    └── server.js           # Express server
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/languagesphere
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd languagesphere
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the languagesphere directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PDF_URL=/path/to/your/book.pdf
```

4. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Payments
- `POST /api/payment/verify` - Verify payment (protected)
- `GET /api/payment/status` - Get payment status (protected)

## Environment Variables

### Backend (.env in server/)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend (.env in languagesphere/)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_PDF_URL` - URL to the book PDF file

## Production Deployment

1. **Backend**:
   - Use a production MongoDB instance (MongoDB Atlas recommended)
   - Set secure environment variables
   - Use a process manager like PM2
   - Enable HTTPS

2. **Frontend**:
   - Build the React app: `npm run build`
   - Serve the build folder using a web server (nginx, Apache, etc.)
   - Configure CORS on the backend for your domain

3. **Payment Integration**:
   - Replace payment verification logic with actual Razorpay/PayPal webhook handlers
   - Implement proper payment verification with payment gateway APIs
   - Add payment receipt generation

4. **Security**:
   - Use strong JWT secrets
   - Enable HTTPS
   - Implement rate limiting
   - Add input validation and sanitization
   - Use environment variables for sensitive data

## Notes

- The PDF viewer is view-only (no download functionality)
- Payment verification currently accepts any payment ID (for development)
- In production, integrate with actual payment gateway webhooks
- MongoDB connection is required for the application to function

## License

This project is proprietary software for Language Sphere.

