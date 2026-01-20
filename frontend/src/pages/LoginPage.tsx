import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tabValue === 1 && password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    setLoading(true);

    try {
      const response =
        tabValue === 0
          ? await authService.login({ email, password })
          : await authService.register({ email, password });

      login(response.user, response.accessToken);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#F8F9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(248, 245, 255, 0.4) 0%, rgba(245, 240, 255, 0.2) 50%, transparent 70%)',
          animation: 'pulse 15s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-10%, -10%) scale(1.1)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, #5B7FE8 0%, #8B6FE8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800, 
              mb: 4, 
              textAlign: 'center',
            }}
          >
            ✨ Task Manager
          </Typography>

          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: 4,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 245, 255, 0.85) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(91, 127, 232, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(91, 127, 232, 0.15)',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#666',
                  '&.Mui-selected': {
                    color: '#5B7FE8',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#5B7FE8',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab label="Logowanie" />
              <Tab label="Rejestracja" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: '12px',
                    background: 'rgba(255, 235, 238, 0.8)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    '&:hover fieldset': {
                      borderColor: '#5B7FE8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5B7FE8',
                    },
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  mb: tabValue === 1 ? 2 : 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    '&:hover fieldset': {
                      borderColor: '#5B7FE8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5B7FE8',
                    },
                  },
                }}
              />

              {tabValue === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Potwierdź hasło"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      '&:hover fieldset': {
                        borderColor: '#5B7FE8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5B7FE8',
                      },
                    },
                  }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5B7FE8 0%, #4A6FD8 100%)',
                  boxShadow: '0 4px 20px 0 rgba(91, 127, 232, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4A6FD8 0%, #3A5FC8 100%)',
                    boxShadow: '0 6px 24px 0 rgba(91, 127, 232, 0.5)',
                  },
                  '&:disabled': {
                    background: '#E0E0E0',
                  },
                }}
              >
                {loading
                  ? 'Ładowanie...'
                  : tabValue === 0
                  ? 'Zaloguj się'
                  : 'Zarejestruj się'}
              </Button>

              {tabValue === 0 && (
                <Box 
                  sx={{ 
                    mt: 3, 
                    textAlign: 'center',
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(248, 245, 255, 0.6)',
                    border: '1px solid rgba(91, 127, 232, 0.15)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    💡 Testowe konto:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5B7FE8' }}>
                    john@example.com / password123
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
