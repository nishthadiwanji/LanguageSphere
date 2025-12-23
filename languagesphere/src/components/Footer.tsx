import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

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
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              textAlign: 'center',
            }}
          >
            Contact us:{' '}
            <Link
              href="mailto:languagesphere.business@gmail.com"
              color="inherit"
              sx={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <EmailIcon sx={{ fontSize: '1rem' }} />
              languagesphere.business@gmail.com
            </Link>
            {' | '}WhatsApp: +1 613-240-5945
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Link
              href="https://wa.me/16132405945"
              target="_blank"
              rel="noopener noreferrer"
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

