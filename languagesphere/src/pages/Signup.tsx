import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StyledCard = styled(Card)({
  maxWidth: 450,
  margin: '0 auto',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, paddingTop: '100px', paddingBottom: '60px' }}>
        <Container maxWidth="sm">
          <StyledCard>
            <CardContent sx={{ padding: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: 3,
                  textAlign: 'center',
                }}
              >
                Sign Up
              </Typography>

              {error && (
                <Alert severity="error" sx={{ marginBottom: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    helperText="Password must be at least 6 characters"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
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
                    fullWidth
                    disabled={loading}
                    sx={{
                      backgroundColor: '#2c3e50',
                      color: '#fff',
                      padding: '12px',
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
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ marginTop: 3, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: '#555',
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Signup;

