import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SchoolIcon from '@mui/icons-material/School';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = styled(Box)({
  padding: '60px 0',
});

const StyledCard = styled(Card)({
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
});

const CourseCard = styled(StyledCard)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
});

const PricingCard = styled(StyledCard)({
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: '#fff',
});

const StructureCard = styled(StyledCard)({
  backgroundColor: '#fff',
  border: '2px solid #e0e0e0',
});

const SubNavbar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#2c3e50',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  top: 64, // Below main navbar
  position: 'sticky',
  zIndex: 1100,
  borderBottom: '2px solid #e0e0e0',
  [theme.breakpoints.down('sm')]: {
    top: 56, // Adjust for mobile navbar height
  },
}));

const IndividualPricingCard = styled(StyledCard)({
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: '#fff',
  '&:nth-of-type(2)': {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  '&:nth-of-type(3)': {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  '&:nth-of-type(4)': {
    background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
});

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const pricingRef = useRef<HTMLDivElement>(null);
  const a1a2Ref = useRef<HTMLDivElement>(null);
  const b1b2tefRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const offset = 140; // Account for sticky navbar
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const sections = [pricingRef, pricingRef, a1a2Ref, pricingRef, pricingRef, b1b2tefRef];
    if (sections[newValue]) {
      scrollToSection(sections[newValue]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <SubNavbar>
        <Toolbar sx={{ justifyContent: 'center', minHeight: '64px !important', padding: '0 20px' }}>
          <Tabs
            value={false}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              width: '100%',
              maxWidth: '1200px',
              display: 'flex',
              justifyContent: 'center',
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
              },
              '& .MuiTab-root': {
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minWidth: 'auto',
                padding: '12px 24px',
                margin: '0 4px',
                color: '#2c3e50',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                },
                '&.Mui-selected': {
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.15)',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-scrollButtons': {
                color: '#2c3e50',
                '&:hover': {
                  backgroundColor: 'rgba(44, 62, 80, 0.1)',
                },
              },
            }}
          >
            <Tab 
              label="A1" 
              onClick={() => scrollToSection(pricingRef)}
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                },
              }}
            />
            <Tab 
              label="A2" 
              onClick={() => scrollToSection(pricingRef)}
              sx={{
                background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%)',
                },
              }}
            />
            <Tab 
              label="A1 + A2" 
              onClick={() => scrollToSection(a1a2Ref)}
              sx={{
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
                },
              }}
            />
            <Tab 
              label="B1" 
              onClick={() => scrollToSection(pricingRef)}
              sx={{
                background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%)',
                },
              }}
            />
            <Tab 
              label="B2" 
              onClick={() => scrollToSection(pricingRef)}
              sx={{
                background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.2) 100%)',
                },
              }}
            />
            <Tab 
              label="B1 + B2 + TEF/TCF" 
              onClick={() => scrollToSection(b1b2tefRef)}
              sx={{
                background: 'linear-gradient(135deg, rgba(48, 207, 208, 0.1) 0%, rgba(51, 8, 103, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(48, 207, 208, 0.2) 0%, rgba(51, 8, 103, 0.2) 100%)',
                },
              }}
            />
          </Tabs>
        </Toolbar>
      </SubNavbar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Section sx={{ backgroundColor: '#f8f9fa', paddingTop: '100px' }}>
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
                marginBottom: 2,
                textAlign: 'center',
              }}
            >
              Course Details & Pricing
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: '#555',
                marginBottom: 5,
                textAlign: 'center',
              }}
            >
              We are extremely happy and grateful for the trust you've shown in us! 🌟
            </Typography>

            {/* Package Pricing */}
            <Box sx={{ marginBottom: 8 }} ref={pricingRef}>
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
                Package Pricing
              </Typography>
              <Grid container spacing={4} sx={{ marginBottom: 6 }}>
                <Grid item xs={12} md={6}>
                  <IndividualPricingCard>
                    <CardContent sx={{ padding: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        Three-Month Package
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        $699
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        Instalment Plan: 
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        1st Instalment: $399 
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        2nd Instalment: $300 (40 days later)
                      </Typography>
                    </CardContent>
                  </IndividualPricingCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <IndividualPricingCard>
                    <CardContent sx={{ padding: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        Seven-Month Package
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 500,
                          marginBottom: 1,
                          opacity: 0.85,
                          textDecoration: 'line-through',
                        }}
                      >
                        $1,500
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        $250 Discount
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        $1,250
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        Instalment Plan: 
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        1st Instalment: $625 
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: 1,
                          opacity: 0.9,
                        }}
                      >
                        2nd Instalment: $625 (40 days later)
                      </Typography>
                    </CardContent>
                  </IndividualPricingCard>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: '#2c3e50',
                  marginBottom: 2,
                }}
              >
                All study materials are provided by us — no extra cost!
                <p>We also offer personalised (1-1 sessions)</p>
                <p>We encourage you to share your availability so that we can plan a schedule together and work towards your language and exam goals effectively.</p>
              </Typography>
            </Box>

            <Divider sx={{ marginY: 6 }} />

            {/* A1 + A2 Program */}
            <div ref={a1a2Ref}>
              <Box sx={{ marginBottom: 8 }}>
                <CourseCard>
                <CardContent sx={{ padding: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
                    <SchoolIcon sx={{ fontSize: 40 }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      A1 + A2 Program
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      marginBottom: 3,
                    }}
                  >
                    Our team consists of highly qualified C1-level and TEF/TCF-certified French teachers, 
                    dedicated to guiding you throughout your French language journey.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      marginBottom: 3,
                    }}
                  >
                    Learning a language is a beautiful journey, and we're here to make it smooth and enjoyable for you!
                    Our A1 + A2 program is designed especially for complete beginners — we start from scratch and help you master:
                  </Typography>
                  <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                    {['🗣️ Speaking', '📖 Reading', '🎧 Listening', '✍️ Writing', '🧩 Grammar', '💡 Vocabulary'].map((skill) => (
                      <Grid item xs={12} sm={6} md={4} key={skill}>
                        <Chip
                          label={skill}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '1rem',
                            padding: '8px',
                            height: 'auto',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      marginBottom: 2,
                    }}
                  >
                    Each batch consists of only 5–6 students, allowing us to give individual attention to every learner and ensure strong progress.
                  </Typography>
                </CardContent>
              </CourseCard>
            </Box>

            {/* Schedule & Duration */}
            <Grid container spacing={4} sx={{ marginBottom: 8 }}>
              <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
                <PricingCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
                      <ScheduleIcon sx={{ fontSize: 40 }} />
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Schedule & Duration
                      </Typography>
                    </Stack>
                    <List>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Class Schedule: Monday to Thursday"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Duration: 1 hour per day"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Course Duration: 3 months"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </PricingCard>
              </Grid>
            </Grid>

            {/* Course Structure */}
            <Box sx={{ marginBottom: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: 4,
                  textAlign: 'center',
                }}
              >
                📚 Course Structure
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <StructureCard>
                    <CardContent sx={{ padding: 4 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: '#2c3e50',
                          marginBottom: 3,
                        }}
                      >
                        A1 – Foundation Building (Month 1–2)
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Grammar & Sentence Formation"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Pronunciation & Accent Practice"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Everyday Vocabulary"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </StructureCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StructureCard>
                    <CardContent sx={{ padding: 4 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: '#2c3e50',
                          marginBottom: 3,
                        }}
                      >
                        A2 – Fluency & Expression (Month 3–4)
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#f5576c' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Using Connectors & Transition Words"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#f5576c' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Dialogues & Real-life Conversations"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#f5576c' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Paraphrasing for Clear Expression"
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </StructureCard>
                </Grid>
              </Grid>
            </Box>

            {/* Additional Features */}
            <Grid container spacing={4} sx={{ marginBottom: 8 }}>
              <Grid item xs={12} md={6}>
                <StructureCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#2c3e50',
                        marginBottom: 2,
                      }}
                    >
                      ✍ Personalized Feedback
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '1rem',
                        lineHeight: 1.8,
                      }}
                    >
                      Targeted practice for speaking and writing
                    </Typography>
                  </CardContent>
                </StructureCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StructureCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#2c3e50',
                        marginBottom: 2,
                      }}
                    >
                      🚀 Accelerated Learning
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '1rem',
                        lineHeight: 1.8,
                      }}
                    >
                      Fast-paced, result-driven lessons
                    </Typography>
                  </CardContent>
                </StructureCard>
              </Grid>
            </Grid>

            </div>

            <Divider sx={{ marginY: 6 }} />

            {/* B1 + B2 + TEF/TCF Program */}
            <div ref={b1b2tefRef}>
              <Box sx={{ marginBottom: 8 }}>
                <CourseCard>
                <CardContent sx={{ padding: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
                    <SchoolIcon sx={{ fontSize: 40 }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      A1 to B2 + TEF/TCF Preparation
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      marginBottom: 3,
                    }}
                  >
                    Learners can join our batches designed for beginners from A1 to B2 level along with TEF/TCF Preparation.
                    Along with A1 to B2 syllabus, these batches focus on fluency, grammar mastery, and comprehensive exam strategies to ensure success in TEF and TCF examinations.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    Program Highlights
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      'A1 to B2 + Exam-Level Preparation',
                      'Advanced Vocabulary Expansion',
                      'Repeated Exam Practice',
                      'Strategic Writing & Speaking Techniques',
                    ].map((highlight) => (
                      <Grid item xs={12} sm={6} key={highlight}>
                        <Chip
                          label={highlight}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.95rem',
                            padding: '8px',
                            height: 'auto',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </CourseCard>
            </Box>

            {/* Exam Practice Focus */}
            <Grid container spacing={4} sx={{ marginBottom: 8 }}>
              <Grid item xs={12} md={6}>
                <StructureCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#2c3e50',
                        marginBottom: 3,
                      }}
                    >
                      TEF Exam Practice Focus
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#667eea',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      🎙 Speaking:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 1: Framing Questions"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 2: Convincing a Friend"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#667eea',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      ✍️ Writing:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 1: Fait divers (News report)"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 2: Formal/Informal Letter Writing"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#667eea',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      📖🎧 Reading & Listening:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.95rem',
                        paddingLeft: 4,
                      }}
                    >
                      Integrated practice to develop comprehension and time-management skills
                    </Typography>
                  </CardContent>
                </StructureCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StructureCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#2c3e50',
                        marginBottom: 3,
                      }}
                    >
                      TCF Exam Practice Focus
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#f5576c',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      🎙 Speaking:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 1: Present Yourself (followed by general questions)"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 2: Framing Questions"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 3: Monologue (Speak on a topic assigned by the examiner)"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#f5576c',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      ✍️ Writing:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 1: Short Message (e.g., message or invitation)"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 2: Blog or Letter Writing"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#f5576c' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Task 3: Paragraph Comparing Two Viewpoints"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '0.95rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: '#f5576c',
                        marginTop: 2,
                        marginBottom: 1,
                      }}
                    >
                      📖🎧 Reading & Listening:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.95rem',
                        paddingLeft: 4,
                      }}
                    >
                      Conducted simultaneously for enhanced comprehension and exam readiness
                    </Typography>
                  </CardContent>
                </StructureCard>
              </Grid>
            </Grid>

            {/* B1+B2 Schedule & Duration */}
            <Grid container spacing={4} sx={{ marginBottom: 8 }}>
              <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
                <PricingCard>
                  <CardContent sx={{ padding: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
                      <ScheduleIcon sx={{ fontSize: 40 }} />
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Schedule & Duration
                      </Typography>
                    </Stack>
                    <List>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Class Schedule: Monday to Thursday"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Duration: 1 hour per day"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Minimum Duration: 7 months"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="We also offer personalised (1-1 sessions)"
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </PricingCard>
              </Grid>
            </Grid>
            </div>

            {/* Contact Section */}
            <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: 2,
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  marginBottom: 1,
                }}
              >
                If you have any questions or concerns, feel free to reach out to:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: 1,
                }}
              >
                Isha Arora | Sumrit Khurana
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: 0.5,
                }}
              >
                
                India Office
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  marginBottom: 2,
                }}
              >
                S-56, Janta Market,
                <br />
                Rajouri Garden,
                <br />
                Delhi – 110027,
                <br />
                India
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  marginBottom: 1,
                }}
              >
                India: +91 81713 18111
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  marginBottom: 3,
                }}
              >
                Canada: +1 (416) 816-4123
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: '#555',
                }}
              >
                If you are looking forward to enroll, we will share the further details!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginTop: 4,
                }}
              >
                We're excited to help you learn French and guide you throughout this journey! 🇫🇷✨
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  marginTop: 2,
                  color: '#555',
                }}
              >
                Language Sphere Team
              </Typography>
            </Box>
          </Container>
        </Section>
      </Box>
      <Footer />
    </Box>
  );
};

export default CourseDetails;

