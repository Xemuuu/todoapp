import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: '#4A90E2',
        boxShadow: 'none',
        borderBottom: '1px solid #E0E0E0',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          📅 TaskCalendar
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              👤 {user.email}
            </Typography>
            <Button 
              color="inherit" 
              onClick={logout}
              sx={{ 
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Wyloguj
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit"
              sx={{ 
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              Loguj
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              Rejestruj
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
