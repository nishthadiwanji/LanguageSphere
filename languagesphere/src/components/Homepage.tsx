import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#fff',
  textAlign: 'center',
  padding: '20px',
});

const Section = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  '&.alt': {
    backgroundColor: '#f8f9fa',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const ServiceCard = styled(StyledCard)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  '&:nth-of-type(2)': {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  '&:nth-of-type(3)': {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  '&:nth-of-type(4)': {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  '&:nth-of-type(5)': {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
});

const ReviewCard = styled(StyledCard)({
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
});

const PayButton = styled(Button)({
  backgroundColor: '#3498db',
  color: '#fff',
  padding: '12px 30px',
  fontSize: '18px',
  borderRadius: '8px',
  textTransform: 'none',
  margin: '10px',
  '&:hover': {
    backgroundColor: '#2980b9',
  },
});

const ContactForm = styled('form')({
  maxWidth: '600px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const OptionCard = styled(Card)({
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
});

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkPaymentStatus } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<{ course: boolean; book: boolean }>({
    course: false,
    book: false,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'course' | 'book' | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handlePaymentComplete = (option: 'course' | 'book') => {
    // In production, this should be called via webhook after payment verification
    // For Razorpay/PayPal, set up webhooks to verify payment and then call this function
    localStorage.setItem(`${option}_payment`, 'true');
    localStorage.setItem(`${option}_payment_date`, new Date().toISOString());
    setPaymentStatus((prev) => ({ ...prev, [option]: true }));
    setOpenDialog(false);
    if (option === 'book') {
      // Navigate to book viewer instead of downloading
      navigate('/book-viewer');
    }
  };

  useEffect(() => {
    // Check payment status from user data
    if (user) {
      setPaymentStatus({
        course: user.payments?.course?.paid || false,
        book: user.payments?.book?.paid || false,
      });
      checkPaymentStatus();
    }

    // Check for payment success in URL parameters (for Razorpay/PayPal redirects)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatusParam = urlParams.get('payment_status');
    const paymentOption = urlParams.get('option') as 'course' | 'book' | null;
    const paymentId = urlParams.get('payment_id');

    if (paymentStatusParam === 'success' && paymentOption && paymentId && user) {
      // Verify payment with backend
      verifyPaymentWithBackend(paymentOption, paymentId);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const verifyPaymentWithBackend = async (option: 'course' | 'book', paymentId: string) => {
    if (!user) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId, option }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentStatus({
          course: data.payments?.course?.paid || false,
          book: data.payments?.book?.paid || false,
        });
        // Refresh payment status from backend to update user context
        await checkPaymentStatus();
        setOpenDialog(false);
        
        if (option === 'book') {
          // Navigate to book viewer instead of downloading
          navigate('/book-viewer');
        }
      } else {
        const errorData = await response.json();
        console.error('Payment verification failed:', errorData);
        alert(`Payment verification failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Failed to verify payment. Please try again.');
    }
  };

  const handlePaymentClick = (option: 'course' | 'book') => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    setSelectedOption(option);
    setOpenDialog(true);
  };


  const services = [
    {
      title: '🌐 Language Training',
      description: 'Comprehensive language courses including TEF/TCF, DELF A1–B2, IELTS/TOEFL/PTE, Spoken English, Business French, Mandarin, Hindi, and Punjabi. Master the languages that open doors to your global future.',
    },
    {
      title: '🛂 Immigration Support',
      description: 'Expert guidance for Study & Work Visas, Francophone Program, Express Entry, PNP, Sponsorship, UAE Business Visas, and Tourist & Investor Options. We help you navigate the immigration process with confidence.',
    },
    {
      title: '📚 Exam Preparation',
      description: 'Specialized training for TEF Canada, TCF, DELF, IELTS, TOEFL, and PTE exams. Our proven strategies and personalized approach ensure you achieve your target scores.',
    },
    {
      title: '💼 Business Language Training',
      description: 'Professional language courses designed for business contexts. Learn Business French and English communication skills to excel in international workplaces.',
    },
    {
      title: '🌍 Multi-Language Support',
      description: 'Learn French, Mandarin, Spanish, Hindi, Punjabi, and English from experienced native and certified instructors. Flexible schedules to fit your lifestyle.',
    },
    {
      title: '📖 Study Materials & Books',
      description: 'Comprehensive study guides and books written by our expert instructors. Get access to PDF versions of our premium study materials to supplement your learning journey.',
    },
  ];

  const reviews = [
    {
      text: "I was completely lost when it came to TEF Canada. Language Sphere not only helped me understand the exam structure but gave me the confidence to actually ace it. The teachers are so patient and knowledgeable. Isha and Sumrit genuinely care about your progress.",
      author: "– Megha Kapoor (New Delhi, India)",
    },
    {
      text: "I had failed my French exam once and was very demotivated. A friend referred me to Language Sphere, and I can't thank them enough. The one-on-one mentorship and 24/7 support made all the difference. I finally got NCLC 7 and submitted my Express Entry profile!",
      author: "– Jaswinder Singh (Surrey, Canada)",
    },
    {
      text: "As someone who's working full time, I needed flexible classes with real accountability. The best part is the recordings and personal doubt clearing. I've studied at other academies, but this feels like a family that wants you to succeed.",
      author: "– Sarah Singhania (Mumbai, India)",
    },
    {
      text: "I didn't just learn French—I learned how to use it for my immigration process. From resume writing in French to dealing with IRCC forms, Language Sphere helped me every step of the way. Highly recommended for anyone serious about their future.",
      author: "– Hamza (Ottawa, Canada)",
    },
    {
      text: "They didn't let me give my IELTS until I was ready, and I'm glad. I got an 8 overall because of their strategy and guidance. It wasn't just theory; it was practical, motivational, and personal.",
      author: "– Poornima (Dubai, UAE)",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/An2Ar7aYAkc?autoplay=1&mute=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <Overlay>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '2.5rem', md: '4rem' },
              marginBottom: 2,
            }}
          >
            Empowering Global Citizens
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: '1.2rem', md: '1.8rem' },
            }}
          >
            Language Training & Immigration Support
          </Typography>
        </Overlay>
      </HeroSection>

      {/* About Section */}
      <Section id="about">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            About Language Sphere
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#555',
              marginBottom: 2,
            }}
          >
            Language Sphere is more than just a language school — it's a global platform built at the intersection of communication and migration. Founded by Isha Arora and Sumrit Khurana, Language Sphere was created with a shared vision: to empower individuals with the language tools and immigration support they need to explore new worlds, build better lives, and succeed anywhere in the world.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#555',
              marginBottom: 2,
            }}
          >
            Whether you're moving abroad for study, work, or permanent settlement, language is your first passport. At Language Sphere, we help you master the languages that open doors — including French, Mandarin, Spanish, Hindi, Punjabi, and English.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#555',
              marginBottom: 2,
            }}
          >
            But we don't stop at language training. We also specialize in immigration support, including study permits, work permits, permanent residency, and business visas for Canada, the UAE (Dubai), and more.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#555',
              marginBottom: 2,
            }}
          >
            With a team of passionate educators and licensed immigration professionals, we ensure that our students and clients are fully equipped—linguistically and legally—to succeed in their international goals.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#555',
            }}
          >
            Join Language Sphere today and take your next step towards a global future.
          </Typography>
        </Container>
      </Section>

      {/* Services Section */}
      <Section id="services" className="alt">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 5,
              textAlign: 'center',
            }}
          >
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ServiceCard>
                  <CardContent sx={{ padding: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: '1.5rem',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.7,
                        flexGrow: 1,
                        fontSize: '1rem',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Course/Book Purchase Section */}
      <Section id="course-book" className="alt">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 2,
              textAlign: 'center',
            }}
          >
            Enroll in Course or Purchase Book
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              marginBottom: 4,
              textAlign: 'center',
              color: '#555',
            }}
          >
            Choose to enroll in our comprehensive language course or purchase our study guide PDF
          </Typography>
          <Grid container spacing={4} sx={{ marginBottom: 4 }}>
            <Grid item xs={12} md={6}>
              <OptionCard
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                }}
              >
                <CardContent sx={{ padding: 4, textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <SchoolIcon sx={{ fontSize: 60, marginBottom: 2 }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      Enroll in Course
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.8,
                        marginBottom: 3,
                      }}
                    >
                      Join our comprehensive language training program with live sessions, recorded classes, and personalized mentorship.
                    </Typography>
                  </Box>
                  {paymentStatus.course ? (
                    <Alert severity="success" sx={{ marginTop: 2 }}>
                      ✓ Payment Confirmed - Course Access Granted
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/course-details');
                        }}
                        sx={{
                          backgroundColor: '#fff',
                          color: '#667eea',
                          padding: '12px 30px',
                          fontSize: '18px',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          width: '100%',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        View Course Details
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePaymentClick('course');
                        }}
                        sx={{
                          borderColor: '#fff',
                          color: '#fff',
                          padding: '12px 30px',
                          fontSize: '18px',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          width: '100%',
                          '&:hover': {
                            borderColor: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Enroll Now
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </OptionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <OptionCard
                onClick={() => !paymentStatus.book && handlePaymentClick('book')}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#fff',
                  opacity: paymentStatus.book ? 0.9 : 1,
                }}
              >
                <CardContent sx={{ padding: 4, textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <BookIcon sx={{ fontSize: 60, marginBottom: 2 }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      Purchase Book PDF
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.8,
                        marginBottom: 3,
                      }}
                    >
                      Get instant access to our comprehensive study guide PDF. Perfect for self-study and exam preparation.
                    </Typography>
                  </Box>
                  {paymentStatus.book ? (
                    <Box>
                      <Alert severity="success" sx={{ marginTop: 2, marginBottom: 2 }}>
                        ✓ Payment Confirmed
                      </Alert>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/book-viewer');
                        }}
                        sx={{
                          backgroundColor: '#fff',
                          color: '#f5576c',
                          padding: '12px 30px',
                          fontSize: '18px',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          width: '100%',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        View PDF
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentClick('book');
                      }}
                      sx={{
                        backgroundColor: '#fff',
                        color: '#f5576c',
                        padding: '12px 30px',
                        fontSize: '18px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        width: '100%',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      Purchase PDF
                    </Button>
                  )}
                </CardContent>
              </OptionCard>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* Reviews Section */}
      <Section id="reviews">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 5,
              textAlign: 'center',
            }}
          >
            What Our Students Say
          </Typography>
          <Grid container spacing={4}>
            {reviews.map((review, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ReviewCard>
                  <CardContent sx={{ padding: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.8,
                        color: '#555',
                        marginBottom: 2,
                        fontSize: '1rem',
                      }}
                    >
                      "{review.text}"
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#2c3e50',
                      }}
                    >
                      {review.author}
                    </Typography>
                  </CardContent>
                </ReviewCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Payment Section */}
      <Section id="payment" className="alt">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 2,
              textAlign: 'center',
            }}
          >
            Make a Payment
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              marginBottom: 4,
              textAlign: 'center',
              color: '#555',
            }}
          >
            Pay securely for our classes using INR or International Payment.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <a
              href="https://rzp.io/l/demointernational"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <PayButton>
                Pay with PayPal
              </PayButton>
            </a>
            <a
              href="https://rzp.io/l/demoindia"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <PayButton>
                Pay with Razorpay (INR)
              </PayButton>
            </a>
          </Box>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section id="contact-form" className="alt">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2c3e50',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            Get In Touch
          </Typography>
          <ContactForm
            action="https://formsubmit.co/languagesphere.business@gmail.com"
            method="POST"
          >
            <input type="hidden" name="_captcha" value="false" />
            <TextField
              name="name"
              label="Your Name"
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              name="email"
              type="email"
              label="Your Email"
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              name="message"
              label="Your Message"
              required
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#2c3e50',
                color: '#fff',
                padding: '12px 30px',
                fontSize: '18px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: "'Poppins', sans-serif",
                '&:hover': {
                  backgroundColor: '#34495e',
                },
              }}
            >
              Send Message
            </Button>
          </ContactForm>
        </Container>
      </Section>

      {/* Payment Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        >
          {selectedOption === 'course' ? 'Enroll in Course' : 'Purchase Book PDF'}
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              marginBottom: 3,
              '& .MuiTab-root': {
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
              },
            }}
          >
            <Tab label="PayPal" />
            <Tab label="Razorpay (INR)" />
          </Tabs>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 2,
              color: '#555',
            }}
          >
            {selectedOption === 'course'
              ? 'Complete your payment to enroll in the course. You will receive access to all course materials and live sessions.'
              : 'Complete your payment to purchase the book PDF. After payment, you will be able to download the PDF immediately.'}
          </Typography>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            {tabValue === 0 ? (
              <a
                href={`https://rzp.io/l/demointernational?option=${selectedOption}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <PayButton>
                  Pay with PayPal
                </PayButton>
              </a>
            ) : (
              <a
                href={`https://rzp.io/l/demoindia?option=${selectedOption}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <PayButton>
                  Pay with Razorpay (INR)
                </PayButton>
              </a>
            )}
          </Box>
          {/* Test Payment Button for Development */}
          <Box sx={{ textAlign: 'center', marginTop: 2, paddingTop: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button
              onClick={() => {
                if (selectedOption) {
                  verifyPaymentWithBackend(selectedOption, `test_payment_${Date.now()}`);
                }
              }}
              variant="outlined"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#45a049',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                },
              }}
            >
              🧪 Test Payment (Development Only)
            </Button>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                marginTop: 1,
                fontFamily: "'Poppins', sans-serif",
                color: '#999',
                fontStyle: 'italic',
              }}
            >
              Click to simulate payment for testing
            </Typography>
          </Box>
          <Alert severity="info" sx={{ marginTop: 3 }}>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Note:</strong> After payment, you will be redirected back. 
              {selectedOption === 'book' 
                ? ' The PDF download will start automatically after payment verification.'
                : ' You will receive course access details via email.'}
              <br />
              <strong>For Production:</strong> Set up success redirect URLs in your Razorpay/PayPal dashboard:
              <br />
              Success URL: {window.location.origin}?payment_status=success&option={selectedOption}&payment_id=PAYMENT_ID
            </Typography>
          </Alert>
          <Alert severity="info" sx={{ marginTop: 3 }}>
            Note: After successful payment, {selectedOption === 'book' ? 'you can download the PDF immediately.' : 'you will receive course access details via email.'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Homepage;

