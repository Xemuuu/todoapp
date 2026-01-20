import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { categoriesService } from '../services/categoriesService';
import type { Category, CreateCategoryDto } from '../types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PRESET_COLORS = [
  '#FF5722', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
];

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, onSave }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4CAF50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setName('');
    setColor('#4CAF50');
    setError('');
  };

  const handleSubmit = async () => {
    if (!user || !name.trim()) return;
    
    setError('');
    setLoading(true);
    try {
      const createData: CreateCategoryDto = {
        name: name.trim(),
        color,
        userId: user.id,
      };
      await categoriesService.create(createData);
      onSave();
      resetForm();
      onClose();
    } catch (err) {
      setError('Błąd tworzenia kategorii');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
        ✨ Nowa Kategoria
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && (
            <Box sx={{ 
              p: 2, 
              bgcolor: '#ffebee', 
              color: '#c62828', 
              borderRadius: 2,
              fontSize: '0.875rem'
            }}>
              {error}
            </Box>
          )}
          
          <TextField
            label="Nazwa kategorii"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            variant="outlined"
            placeholder="np. Praca, Osobiste, Sport"
          />

          <Box>
            <Box sx={{ mb: 1, color: '#666', fontSize: '0.875rem' }}>
              Wybierz kolor
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((presetColor) => (
                <Box
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: presetColor,
                    cursor: 'pointer',
                    border: color === presetColor ? '3px solid #1976d2' : '2px solid #E0E0E0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
          Anuluj
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !name.trim()}
          sx={{
            background: '#4A90E2',
            color: 'white',
            fontWeight: 600,
            px: 3,
            borderRadius: '10px',
            '&:hover': {
              background: '#3A7BC8',
            },
          }}
        >
          {loading ? 'Tworzenie...' : 'Utwórz'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
