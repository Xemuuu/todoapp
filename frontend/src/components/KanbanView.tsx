import { Box, Typography } from '@mui/material';
import { TaskStatus } from '../types';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  categories?: { color: string; name: string }[];
}

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick?: (taskId: number) => void;
}

export const KanbanView = ({ tasks, onTaskClick }: KanbanViewProps) => {
  const columns = [
    { status: TaskStatus.TODO, title: '📋 To Do', color: '#9E9E9E' },
    { status: TaskStatus.IN_PROGRESS, title: '🔄 In Progress', color: '#5B7FE8' },
    { status: TaskStatus.DONE, title: '✅ Done', color: '#4CAF50' },
    { status: TaskStatus.FAILED, title: '❌ Failed', color: '#F44336' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityIcon = (priority?: string) => {
    const icons: Record<string, string> = {
      LOW: '✓',
      MEDIUM: '⚡',
      HIGH: '🔥',
    };
    return icons[priority || 'MEDIUM'] || '⚡';
  };

  const getPriorityStyle = (priority?: string) => {
    const styleMap: Record<string, { bg: string; color: string }> = {
      LOW: { bg: '#E8F5E9', color: '#2E7D32' },
      MEDIUM: { bg: '#FFF3E0', color: '#E65100' },
      HIGH: { bg: '#FFEBEE', color: '#C62828' },
    };
    return styleMap[priority || 'MEDIUM'] || styleMap.MEDIUM;
  };

  const getCategoryStyle = (color?: string) => {
    if (!color) {
      return { bg: '#E3F2FD', color: '#1565C0' };
    }
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 33, g: 150, b: 243 };
    };
    
    const rgb = hexToRgb(color);
    const bg = `rgba(${Math.round(rgb.r * 0.05 + 255 * 0.95)}, ${Math.round(rgb.g * 0.05 + 255 * 0.95)}, ${Math.round(rgb.b * 0.05 + 255 * 0.95)}, 0.8)`;
    const textColor = `rgb(${Math.round(rgb.r * 0.7)}, ${Math.round(rgb.g * 0.7)}, ${Math.round(rgb.b * 0.7)})`;
    
    return { bg, color: textColor };
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: 3,
      minHeight: '70vh',
    }}>
      {columns.map((column) => (
        <Box
          key={column.status}
          sx={{
            background: '#FFFFFF',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Column Header */}
          <Box sx={{ 
            mb: 2, 
            pb: 2, 
            borderBottom: `3px solid ${column.color}`,
          }}>
            <Typography sx={{ 
              fontSize: '1.1rem', 
              fontWeight: 700,
              color: '#1a1a1a',
            }}>
              {column.title}
            </Typography>
            <Typography sx={{ 
              fontSize: '0.85rem', 
              color: '#666',
              mt: 0.5,
            }}>
              {getTasksByStatus(column.status).length} {getTasksByStatus(column.status).length === 1 ? 'task' : 'tasks'}
            </Typography>
          </Box>

          {/* Tasks */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
            overflowY: 'auto',
            flex: 1,
          }}>
            {getTasksByStatus(column.status).map((task) => (
              <Box
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                sx={{
                  background: 'linear-gradient(135deg, rgba(250, 245, 255, 0.9) 0%, rgba(245, 240, 255, 0.75) 100%)',
                  backdropFilter: 'blur(12px)',
                  border: `2px solid ${column.color}`,
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Title */}
                <Typography sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  lineHeight: 1.3,
                }}>
                  {task.title}
                </Typography>

                {/* Description */}
                {task.description && (
                  <Typography sx={{
                    fontSize: '0.75rem',
                    color: '#666',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {task.description}
                  </Typography>
                )}

                {/* Priority & Categories */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 'auto' }}>
                  {task.priority && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 2,
                        background: getPriorityStyle(task.priority).bg,
                        border: `1.5px solid ${getPriorityStyle(task.priority).color}`,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: getPriorityStyle(task.priority).color,
                      }}
                    >
                      {getPriorityIcon(task.priority)} {task.priority}
                    </Box>
                  )}
                  {task.categories?.map((category, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 2,
                        background: getCategoryStyle(category.color).bg,
                        border: `0.5px solid ${getCategoryStyle(category.color).color}50`,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: getCategoryStyle(category.color).color,
                      }}
                    >
                      {category.name}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
