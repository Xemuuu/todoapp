import { useState, useEffect } from 'react';
import { Box, Container, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { WeekView } from '../components/WeekView';
import { KanbanView } from '../components/KanbanView';
import { TaskDialog } from '../components/TaskDialog';
import { CategoryDialog } from '../components/CategoryDialog';
import { tasksService } from '../services/tasksService';
import { categoriesService } from '../services/categoriesService';
import type { Task, Category } from '../types';

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Poniedziałek jako początek
    return new Date(today.setDate(diff));
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'calendar' | 'kanban'>('calendar');

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksService.getAll({ limit: 1000 });
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      task.categories?.some(cat => cat.id === selectedCategory);
    
    if (view === 'calendar') {
      if (!task.startDateTime || !task.endDateTime) return false;
      
      const taskStart = new Date(task.startDateTime);
      const taskEnd = new Date(task.endDateTime);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const matchesWeek = taskStart < weekEnd && taskEnd >= weekStart;
      return matchesSearch && matchesCategory && matchesWeek;
    } else {
      if (task.startDateTime || task.endDateTime) return false;
      return matchesSearch && matchesCategory;
    }
  });

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newWeekStart);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setWeekStart(new Date(today.setDate(diff)));
  };

  const handleTaskClick = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleDialogSave = async () => {
    await loadTasks();
    handleDialogClose();
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleAddCategory = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };

  const handleCategoryDialogSave = async () => {
    await loadCategories();
    handleCategoryDialogClose();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#F8F9FA',
      }}
    >
      {/* Top Bar */}
      <TopBar />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={handleAddCategory}
          />
        </Box>

        {/* View Switcher */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            background: '#FFFFFF', 
            borderRadius: 3,
            p: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <Box
              onClick={() => setView('calendar')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: view === 'calendar' ? 'linear-gradient(135deg, #5B7FE8 0%, #4A6FD8 100%)' : 'transparent',
                color: view === 'calendar' ? '#FFFFFF' : '#666',
                fontWeight: view === 'calendar' ? 600 : 500,
                fontSize: '0.95rem',
                '&:hover': {
                  background: view === 'calendar' ? 'linear-gradient(135deg, #5B7FE8 0%, #4A6FD8 100%)' : '#F8F9FA',
                },
              }}
            >
              📅 Calendar
            </Box>
            <Box
              onClick={() => setView('kanban')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: view === 'kanban' ? 'linear-gradient(135deg, #5B7FE8 0%, #4A6FD8 100%)' : 'transparent',
                color: view === 'kanban' ? '#FFFFFF' : '#666',
                fontWeight: view === 'kanban' ? 600 : 500,
                fontSize: '0.95rem',
                '&:hover': {
                  background: view === 'kanban' ? 'linear-gradient(135deg, #5B7FE8 0%, #4A6FD8 100%)' : '#F8F9FA',
                },
              }}
            >
              📊 Kanban
            </Box>
          </Box>
        </Box>

        {/* Week Navigation */}
        {view === 'calendar' && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box
            onClick={goToPreviousWeek}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              border: '1px solid #E0E0E0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#F0F4FF',
                borderColor: '#5B7FE8',
              },
            }}
          >
            ←
          </Box>
          <Box
            onClick={goToCurrentWeek}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              background: '#FFFFFF',
              border: '1px solid #E0E0E0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#F0F4FF',
                borderColor: '#5B7FE8',
              },
            }}
          >
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a' }}>
              {weekStart.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
          <Box
            onClick={goToNextWeek}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              border: '1px solid #E0E0E0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#F0F4FF',
                borderColor: '#5B7FE8',
              },
            }}
          >
            →
          </Box>
        </Box>
        )}

        {/* Week View or Kanban View */}
        <Box>
          {view === 'calendar' ? (
            <WeekView tasks={filteredTasks} weekStart={weekStart} onTaskClick={handleTaskClick} />
          ) : (
            <KanbanView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          )}
        </Box>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddTask}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: '#4A90E2',
          '&:hover': {
            background: '#3A7BC8',
          },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        categories={categories}
        allTasks={tasks}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />

      {/* Category Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onClose={handleCategoryDialogClose}
        onSave={handleCategoryDialogSave}
      />
    </Box>
  );
};
