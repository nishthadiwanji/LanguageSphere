import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Dialog,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

// TEMPORARY: Set to true to bypass payment check for testing
// REMOVE OR SET TO FALSE IN PRODUCTION
const BYPASS_PAYMENT_CHECK = false;

const PDFViewer = styled(Box)({
  width: '100%',
  height: '80vh',
  minHeight: '600px',
  border: 'none',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '& object': {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  },
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 'none',
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
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const hasFetchedRef = useRef(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Create a stable value for payment status to use in dependencies
  const isPaymentValid = useMemo(() => {
    if (BYPASS_PAYMENT_CHECK) return true;
    return user?.payments?.book?.paid === true;
  }, [user?.payments?.book?.paid]);

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check payment status on mount only
  useEffect(() => {
    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent right-click and keyboard shortcuts in fullscreen mode
  useEffect(() => {
    if (!fullscreenOpen) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S / Cmd+S (save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Prevent Ctrl+P / Cmd+P (print) - optional, you might want to allow this
      // if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   return false;
      // }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [fullscreenOpen]);

  // Fetch PDF URL only once when token and payment status are valid
  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetchedRef.current || pdfUrl) {
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    // If payment check is required, wait for user data to be loaded
    if (!BYPASS_PAYMENT_CHECK && !user) {
      return;
    }

    // If payment check is required and user hasn't paid, don't fetch
    if (!isPaymentValid) {
      setLoading(false);
      return;
    }

    // Mark as fetched to prevent duplicate requests
    hasFetchedRef.current = true;

    // Fetch PDF URL from backend
    const fetchPdfUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/payment/pdf-url`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = 'Failed to get PDF URL';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.pdfUrl) {
          throw new Error('PDF URL not provided by server');
        }
        
        // Validate that the PDF URL is a proper HTTP/HTTPS URL (not a file path)
        const pdfUrlString = String(data.pdfUrl);
        if (!pdfUrlString.startsWith('http://') && !pdfUrlString.startsWith('https://')) {
          console.error('Invalid PDF URL format (expected http:// or https://):', pdfUrlString);
          throw new Error('Invalid PDF URL format. Please contact support.');
        }
        
        console.log('PDF URL received:', pdfUrlString);
        
        // Set the PDF URL - it will load in the iframe/object tag
        setPdfUrl(pdfUrlString);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching PDF URL:', err);
        setError(err.message || 'Failed to load PDF. Please try again later.');
        // Reset the ref on error so user can retry
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [token, isPaymentValid, API_URL]);

  // Skip payment check UI if bypass is enabled
  if (!BYPASS_PAYMENT_CHECK && !user?.payments?.book?.paid) {
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
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                minHeight: '400px',
              }}
            >
              <CircularProgress sx={{ marginBottom: 2 }} />
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
                {useIframe ? (
                  // Fallback to iframe if object fails
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    title="Study Guide PDF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    onLoad={() => {
                      console.log('PDF iframe loaded successfully');
                      setError(null);
                    }}
                    onError={() => {
                      console.error('PDF iframe loading error');
                      setError('Failed to load PDF. Please try refreshing the page.');
                    }}
                  />
                ) : (
                  // Use object tag (more reliable for PDFs)
                  <object
                    data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    type="application/pdf"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    onError={() => {
                      console.warn('PDF object failed, trying iframe fallback');
                      setUseIframe(true);
                    }}
                  >
                    <Alert severity="warning" sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                        Your browser does not support PDF viewing. Please use a modern browser like Chrome, Firefox, or Edge.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setUseIframe(true)}
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          textTransform: 'none',
                        }}
                      >
                        Try Alternative View
                      </Button>
                    </Alert>
                  </object>
                )}
              </PDFViewer>
              <Box sx={{ marginTop: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Alert severity="info" sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    This PDF is view-only. Downloading and printing are disabled for security purposes.
                  </Typography>
                </Alert>
                <Button
                  variant="outlined"
                  startIcon={<FullscreenIcon />}
                  onClick={() => setFullscreenOpen(true)}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    textTransform: 'none',
                  }}
                >
                  Fullscreen View
                </Button>
              </Box>
              {/* Fullscreen PDF Viewer Dialog */}
              <Dialog
                fullScreen
                open={fullscreenOpen}
                onClose={() => setFullscreenOpen(false)}
                sx={{
                  '& .MuiDialog-paper': {
                    backgroundColor: '#2c3e50',
                  },
                }}
              >
                <AppBar sx={{ position: 'relative', backgroundColor: '#2c3e50' }}>
                  <Toolbar>
                    <Typography sx={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem' }}>
                      Study Guide PDF (View Only)
                    </Typography>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={() => setFullscreenOpen(false)}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Box
                  ref={fullscreenContainerRef}
                  sx={{
                    width: '100%',
                    height: 'calc(100vh - 64px)',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#525252',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                    }}
                    title="Study Guide PDF Fullscreen"
                    allow="fullscreen"
                  />
                </Box>
              </Dialog>
              {/* Debug info in development */}
              {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ marginTop: 2 }}>
                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    PDF URL: {pdfUrl}
                  </Typography>
                </Alert>
              )}
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

