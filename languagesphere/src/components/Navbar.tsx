import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(null);
  const [servicesOpenMobile, setServicesOpenMobile] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleServicesMouseEnter = () => {
    if (!isMobile && buttonRef.current) {
      // Clear any pending timeout
      if (menuTimeout) {
        clearTimeout(menuTimeout);
        setMenuTimeout(null);
      }
      setIsHoveringMenu(false);
      setServicesAnchorEl(buttonRef.current);
    }
  };

  const handleServicesMouseLeave = () => {
    if (!isMobile) {
      // Start timeout to close, but it will be cancelled if mouse enters menu
      const timeout = setTimeout(() => {
        // Double check we're not hovering before closing
        if (!isHoveringMenu) {
          setServicesAnchorEl(null);
        }
      }, 150);
      setMenuTimeout(timeout);
    }
  };

  const handleMenuMouseEnter = () => {
    // Cancel any pending close timeout immediately
    if (menuTimeout) {
      clearTimeout(menuTimeout);
      setMenuTimeout(null);
    }
    setIsHoveringMenu(true);
    // Force menu to stay open
    if (!isMobile && buttonRef.current) {
      setServicesAnchorEl(buttonRef.current);
    }
  };

  const handleMenuMouseLeave = () => {
    if (!isMobile) {
      setIsHoveringMenu(false);
      // Close immediately when leaving menu
      if (menuTimeout) {
        clearTimeout(menuTimeout);
        setMenuTimeout(null);
      }
      setServicesAnchorEl(null);
    }
  };

  const handleServicesClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setServicesOpenMobile(!servicesOpenMobile);
    } else {
      setServicesAnchorEl(event.currentTarget);
    }
  };

  const handleServicesClose = () => {
    setIsHoveringMenu(false);
    if (menuTimeout) {
      clearTimeout(menuTimeout);
      setMenuTimeout(null);
    }
    setServicesAnchorEl(null);
  };

  const serviceItems = [
    { label: 'Language Training', href: '#services' },
    { label: 'Immigration Support', href: '#services' },
    { label: 'Exam Preparation', href: '#services' },
    { label: 'Business Language Training', href: '#services' },
    { label: 'Multi-Language Support', href: '#services' },
    { label: 'Study Materials & Books', href: '#course-book' },
  ];

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services', hasDropdown: true },
    { label: 'Course Details & Pricing', href: '/course-details' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Payments', href: '#payment' },
    { label: 'Contact', href: '#contact' },
    ...(!user ? [
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: 'center' }}
                component={item.hasDropdown ? 'div' : 'button'}
                onClick={item.hasDropdown ? handleServicesClick : () => {
                  if (item.href.startsWith('/')) {
                    navigate(item.href);
                  } else {
                    // For anchor links, check if we're on homepage
                    if (location.pathname !== '/') {
                      // Navigate to home first, then scroll to section
                      navigate('/');
                      setTimeout(() => {
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 300);
                    } else {
                      // Already on homepage, just scroll
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary={item.label} />
                {item.hasDropdown && (servicesOpenMobile ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.hasDropdown && (
              <Collapse in={servicesOpenMobile} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {serviceItems.map((serviceItem) => (
                    <ListItem key={serviceItem.label} disablePadding>
                      <ListItemButton
                        sx={{ textAlign: 'center', pl: 4 }}
                        component="button"
                        onClick={() => {
                          // Check if we're on homepage
                          if (location.pathname !== '/') {
                            // Navigate to home first, then scroll to section
                            navigate('/');
                            setTimeout(() => {
                              const element = document.querySelector(serviceItem.href);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 300);
                          } else {
                            // Already on homepage, just scroll
                            const element = document.querySelector(serviceItem.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }
                          handleDrawerToggle();
                        }}
                      >
                        <ListItemText primary={serviceItem.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              component="button"
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#2c3e50', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: '1.5rem',
            }}
          >
            Language Sphere
          </Typography>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                item.hasDropdown ? (
                  <Box 
                    key={item.label}
                    onMouseEnter={handleServicesMouseEnter}
                    onMouseLeave={handleServicesMouseLeave}
                    sx={{ 
                      position: 'relative', 
                      display: 'inline-block',
                    }}
                  >
                    <Button
                      ref={buttonRef}
                      color="inherit"
                      component="a"
                      href={item.href}
                      onClick={handleServicesClick}
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      {item.label}
                      <ArrowDropDownIcon sx={{ fontSize: '1.2rem', marginLeft: 0.5 }} />
                    </Button>
                    <Menu
                      anchorEl={servicesAnchorEl}
                      open={Boolean(servicesAnchorEl)}
                      onClose={(event, reason) => {
                        // Only allow closing on backdrop click or escape key
                        // Prevent all other automatic closes
                        if (reason === 'backdropClick') {
                          handleServicesClose();
                        } else if (reason === 'escapeKeyDown') {
                          handleServicesClose();
                        }
                        // Ignore all other close reasons (tabKeyDown, blur, etc.)
                      }}
                      MenuListProps={{
                        onMouseEnter: handleMenuMouseEnter,
                        onMouseLeave: handleMenuMouseLeave,
                        'aria-labelledby': 'services-button',
                        onMouseDown: (e) => {
                          // Prevent menu from closing on click inside
                          e.stopPropagation();
                        },
                      }}
                      PaperProps={{
                        onMouseEnter: handleMenuMouseEnter,
                        onMouseLeave: handleMenuMouseLeave,
                        sx: {
                          mt: 0,
                          minWidth: 200,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          pointerEvents: 'auto',
                        },
                      }}
                      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      disableAutoFocusItem={true}
                      disableRestoreFocus={true}
                      keepMounted={false}
                      disablePortal={false}
                      disableEnforceFocus={true}
                    >
                      {serviceItems.map((serviceItem) => (
                        <MenuItem
                          key={serviceItem.label}
                          component="button"
                          onClick={() => {
                            handleServicesClose();
                            // Check if we're on homepage
                            if (location.pathname !== '/') {
                              // Navigate to home first, then scroll to section
                              navigate('/');
                              setTimeout(() => {
                                const element = document.querySelector(serviceItem.href);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 300);
                            } else {
                              // Already on homepage, just scroll
                              const element = document.querySelector(serviceItem.href);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }
                          }}
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.95rem',
                            padding: '10px 20px',
                            width: '100%',
                            '&:hover': {
                              backgroundColor: 'rgba(44, 62, 80, 0.1)',
                            },
                          }}
                        >
                          {serviceItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    component="button"
                    onClick={() => {
                      if (item.href.startsWith('/')) {
                        navigate(item.href);
                      } else {
                        // For anchor links, check if we're on homepage
                        if (location.pathname !== '/') {
                          // Navigate to home first, then scroll to section
                          navigate('/');
                          setTimeout(() => {
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 300);
                        } else {
                          // Already on homepage, just scroll
                          const element = document.querySelector(item.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }
                    }}
                    variant={item.label === 'Sign Up' ? 'outlined' : 'text'}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: 'none',
                      fontSize: '1rem',
                      ...(item.label === 'Sign Up' && {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          borderColor: '#fff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }),
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              ))}
              {user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;

