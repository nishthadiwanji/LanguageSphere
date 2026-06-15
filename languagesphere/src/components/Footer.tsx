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
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <LocationOnIcon sx={{ fontSize: '1.1rem' }} />
            S-56 Rajouri Garden, Janta Market, Delhi - 110027
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
              Canada: +1 (416) 816-4123
            </Link>
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ pt: 1 }}>
            <Link
              href="https://wa.me/918171318111"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp India"
              sx={{
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 40 }} />
            </Link>
            <Link
              href="https://wa.me/14168164123"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Canada"
              sx={{
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 40 }} />
            </Link>
            <Link
              href="https://www.instagram.com/languagesphere"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              sx={{
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <InstagramIcon sx={{ fontSize: 40 }} />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

