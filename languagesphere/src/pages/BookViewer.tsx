import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

const PDFViewer = styled(Box)({
  width: '100%',
  height: '80vh',
  minHeight: '600px',
  border: 'none',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'auto',
  },
  '& embed': {
    width: '100%',
    height: '100%',
    border: 'none',
  },
});

const BookViewerContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkPaymentStatus, token } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkPaymentStatus();
  }, [checkPaymentStatus]);

  useEffect(() => {
    // Fetch PDF URL from backend only if user has paid
    const fetchPdfUrl = async () => {
      if (!user?.payments?.book?.paid || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/payment/pdf-url`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to get PDF URL');
        }

        const data = await response.json();
        setPdfUrl(data.pdfUrl);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching PDF URL:', err);
        setError(err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [user, token, API_URL]);

  if (!user?.payments?.book?.paid) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, paddingTop: '100px', paddingBottom: '60px' }}>
          <Container maxWidth="lg">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                marginBottom: 4,
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                color: '#2c3e50',
                '&:hover': {
                  backgroundColor: 'rgba(44, 62, 80, 0.1)',
                },
              }}
            >
              Back to Home
            </Button>
            <Paper
              sx={{
                padding: 4,
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Alert severity="warning" sx={{ marginBottom: 3 }}>
                You need to purchase the book to view it.
              </Alert>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: 2,
                }}
              >
                Purchase Required
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: '#555',
                  marginBottom: 3,
                }}
              >
                Please complete your payment to access the book PDF.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  backgroundColor: '#2c3e50',
                  color: '#fff',
                  padding: '12px 30px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#34495e',
                  },
                }}
              >
                Go to Purchase
              </Button>
            </Paper>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, paddingTop: '100px', paddingBottom: '60px' }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              marginBottom: 4,
              fontFamily: "'Poppins', sans-serif",
              textTransform: 'none',
              color: '#2c3e50',
              '&:hover': {
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
              },
            }}
          >
            Back to Home
          </Button>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 3,
              textAlign: 'center',
            }}
          >
            Study Guide PDF
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
              <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                Loading PDF...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ marginTop: 3 }}>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                {error}
              </Typography>
            </Alert>
          ) : pdfUrl ? (
            <>
              <PDFViewer>
                {/* Use Google Docs Viewer as fallback for better compatibility with cloud-hosted PDFs */}
                {pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://') ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                    title="Study Guide PDF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    onError={() => {
                      // Fallback to direct URL if Google Viewer fails
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.src = pdfUrl;
                      }
                    }}
                  />
                ) : (
                  <iframe
                    src={pdfUrl}
                    title="Study Guide PDF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                )}
              </PDFViewer>
              <Alert severity="info" sx={{ marginTop: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  This PDF is view-only. Downloading and printing are disabled for security purposes.
                </Typography>
              </Alert>
            </>
          ) : null}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

const BookViewer: React.FC = () => {
  return (
    <ProtectedRoute>
      <BookViewerContent />
    </ProtectedRoute>
  );
};

export default BookViewer;

