import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookViewer from './pages/BookViewer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Homepage />
                </Box>
                <Footer />
              </Box>
            }
          />
          <Route path="/course-details" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/book-viewer"
            element={
              <ProtectedRoute>
                <BookViewer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
