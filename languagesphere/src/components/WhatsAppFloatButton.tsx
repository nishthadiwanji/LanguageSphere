import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WHATSAPP_URL = 'https://wa.me/14168164123';

const WhatsAppFloatButton: React.FC = () => {
  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Fab
        component="a"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp at +1 416 816 4123"
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1300,
          width: { xs: 60, sm: 64 },
          height: { xs: 60, sm: 64 },
          backgroundColor: '#25D366',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.45)',
          '&:hover': {
            backgroundColor: '#1ebe57',
            boxShadow: '0 6px 24px rgba(37, 211, 102, 0.55)',
            transform: 'scale(1.05)',
          },
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
      </Fab>
    </Tooltip>
  );
};

export default WhatsAppFloatButton;
