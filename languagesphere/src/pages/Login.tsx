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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
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
                Login
              </Typography>

              {error && (
                <Alert severity="error" sx={{ marginBottom: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
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
                    {loading ? 'Logging in...' : 'Login'}
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
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
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

export default Login;

