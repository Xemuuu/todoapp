import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { tasksService } from '../services/tasksService';
import { TaskStatus, TaskPriority } from '../types';
import type { Task, Category, CreateTaskDto, UpdateTaskDto } from '../types';

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  categories: Category[];
  allTasks: Task[];
  onClose: () => void;
  onSave: () => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, categories, allTasks, onClose, onSave }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Wypełnij formularz przy edycji
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setCategoryIds(task.categories?.map(c => c.id) || []);
      setStartDateTime(task.startDateTime ? task.startDateTime.slice(0, 16) : '');
      setEndDateTime(task.endDateTime ? task.endDateTime.slice(0, 16) : '');
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setPriority(TaskPriority.MEDIUM);
    setCategoryIds([]);
    setStartDateTime('');
    setEndDateTime('');
  };

  const handleSubmit = async () => {
    if (!user || !title.trim()) return;

    // Normalizuj puste stringi do pustych wartości
    const start = startDateTime.trim();
    const end = endDateTime.trim();

    // Walidacja: obydwa pola datetime muszą być wypełnione lub obydwa puste
    if ((start && !end) || (!start && end)) {
      setError('Podaj zarówno datę rozpoczęcia jak i zakończenia, lub zostaw oba pola puste dla taska bez czasu.');
      return;
    }

    // Walidacja: data zakończenia musi być po dacie rozpoczęcia
    if (start && end) {
      const newStart = new Date(start);
      const newEnd = new Date(end);
      
      if (newEnd <= newStart) {
        setError('Data zakończenia musi być późniejsza niż data rozpoczęcia.');
        return;
      }
      
      // Walidacja: sprawdź czy istnieje już task w tym czasie
      const hasConflict = allTasks.some(existingTask => {
        // Pomiń aktualnie edytowany task podczas edycji
        if (task && existingTask.id === task.id) {
          return false;
        }
        
        // Pomiń taski bez dat
        if (!existingTask.startDateTime || !existingTask.endDateTime) {
          return false;
        }
        
        const existingStart = new Date(existingTask.startDateTime);
        const existingEnd = new Date(existingTask.endDateTime);
        
        // Sprawdź czy przedziały się nakładają
        return (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      });
      
      if (hasConflict) {
        setError('W tym czasie istnieje już inny task. Możesz mieć tylko jeden task na raz.');
        return;
      }
    }
    
    setError('');
    setLoading(true);
    try {
      if (task) {
        // Edycja
        const updateData: UpdateTaskDto = {
          title,
          description: description || undefined,
          status,
          priority,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          startDateTime: startDateTime.trim() || undefined,
          endDateTime: endDateTime.trim() || undefined,
        };
        await tasksService.update(task.id, updateData);
      } else {
        // Tworzenie
        const createData: CreateTaskDto = {
          title,
          description: description || undefined,
          status,
          priority,
          userId: user.id,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          startDateTime: startDateTime.trim() || undefined,
          endDateTime: endDateTime.trim() || undefined,
        };
        await tasksService.create(createData);
      }
      onSave();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Błąd podczas zapisu taska:', err);
      setError('Błąd zapisu taska');
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
        {task ? '✏️ Edytuj Task' : '✨ Nowy Task'}
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
            label="Tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <MenuItem value={TaskStatus.TODO}>📋 TODO</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>🔄 IN PROGRESS</MenuItem>
              <MenuItem value={TaskStatus.DONE}>✅ DONE</MenuItem>
              <MenuItem value={TaskStatus.FAILED}>❌ FAILED</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priorytet</InputLabel>
            <Select
              value={priority}
              label="Priorytet"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value={TaskPriority.LOW}>🟢 LOW</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>🟡 MEDIUM</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>🔴 HIGH</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Kategorie</InputLabel>
            <Select
              multiple
              value={categoryIds}
              label="Kategorie"
              onChange={(e) => setCategoryIds(e.target.value as number[])}
              renderValue={(selected) => 
                categories
                  .filter(cat => selected.includes(cat.id))
                  .map(cat => cat.name)
                  .join(', ')
              }
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                      }}
                    />
                    {cat.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data i godzina rozpoczęcia (opcjonalnie)"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Data i godzina zakończenia (opcjonalnie)"
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, justifyContent: task ? 'space-between' : 'flex-end' }}>
        {task && (
          <Button 
            onClick={async () => {
              if (window.confirm('Czy na pewno chcesz usunąć ten task?')) {
                setLoading(true);
                try {
                  await tasksService.delete(task.id);
                  onSave();
                  handleClose();
                } catch (err) {
                  setError('Błąd usuwania taska');
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={loading}
            sx={{ 
              color: '#d32f2f',
              fontWeight: 600,
              '&:hover': {
                background: '#ffebee',
              },
            }}
          >
            🗑️ Usuń
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
            Anuluj
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !title.trim()}
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
            {loading ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
