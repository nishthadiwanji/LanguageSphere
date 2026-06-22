import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

const contactLinkSx = {
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  '&:hover': {
    textDecoration: 'underline',
  },
};

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2c3e50',
        color: '#fff',
        padding: '40px 0',
        marginTop: 'auto',
      }}
      id="contact"
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            Canada Office
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'flex-start',
              gap: 0.5,
            }}
          >
            <LocationOnIcon sx={{ fontSize: '1.1rem', mt: 0.3 }} />
            <span>
              545 Sherbourne St,
              <br />
              Toronto, ON M4X 1W5,
              <br />
              Canada
            </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
              fontWeight: 600,
              pt: 1,
            }}
          >
            India Office
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'flex-start',
              gap: 0.5,
            }}
          >
            <LocationOnIcon sx={{ fontSize: '1.1rem', mt: 0.3 }} />
            <span>
              S-56, Janta Market,
              <br />
              Rajouri Garden,
              <br />
              Delhi – 110027,
              <br />
              India
            </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
            }}
          >
            <Link href="mailto:languagesphere.business@gmail.com" color="inherit" sx={contactLinkSx}>
              <EmailIcon sx={{ fontSize: '1rem' }} />
              languagesphere.business@gmail.com
            </Link>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
            }}
          >
            <Link href="tel:+918171318111" color="inherit" sx={contactLinkSx}>
              <PhoneIcon sx={{ fontSize: '1rem' }} />
              India: +91 81713 18111
            </Link>
            {' | '}
            <Link href="tel:+14168164123" color="inherit" sx={contactLinkSx}>
              Canada: +1 (416) 816-4123 , +1 (437) 237 7212 
            </Link>
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ pt: 1 }}>
            
            <Link
              href="https://www.instagram.com/languagespherefrench"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @languagespherefrench"
              sx={{
                color: '#fff',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <InstagramIcon sx={{ fontSize: 40 }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.75rem',
                }}
              >
                @languagespherefrench
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

