import { Box, Typography } from '@mui/material';

interface Task {
  id: number;
  title: string;
  startDateTime?: string;
  endDateTime?: string;
  status?: string;
  priority?: string;
  categories?: { color: string; name: string }[];
}

interface WeekViewProps {
  tasks: Task[];
  weekStart: Date;
  onTaskClick?: (taskId: number) => void;
}

export const WeekView = ({ tasks, weekStart, onTaskClick }: WeekViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const parseLocalDate = (dateString: string): Date => {
    const cleanDate = dateString.replace('Z', '');
    return new Date(cleanDate);
  };

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getDayName = (date: Date): string => {
    const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return dayNames[date.getDay()];
  };

  const getTasksForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      if (!task.startDateTime || !task.endDateTime) return false;
      const taskStart = parseLocalDate(task.startDateTime);
      const taskEnd = parseLocalDate(task.endDateTime);
      return taskStart < dayEnd && taskEnd > dayStart;
    });
  };

  const getHoursWithTasks = (): Set<number> => {
    const hoursSet = new Set<number>();
    
    days.forEach(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayTasks = tasks.filter(task => {
        if (!task.startDateTime || !task.endDateTime) return false;
        const taskStart = parseLocalDate(task.startDateTime);
        const taskEnd = parseLocalDate(task.endDateTime);
        return taskStart < dayEnd && taskEnd > dayStart;
      });
      
      dayTasks.forEach(task => {
        if (!task.startDateTime || !task.endDateTime) return;
        const taskStart = parseLocalDate(task.startDateTime);
        const taskEnd = parseLocalDate(task.endDateTime);
        
        for (let h = 0; h < 24; h++) {
          const hourStartTime = new Date(day);
          hourStartTime.setHours(h, 0, 0, 0);
          const hourEndTime = new Date(day);
          hourEndTime.setHours(h + 1, 0, 0, 0);
          
          if (taskStart < hourEndTime && taskEnd > hourStartTime) {
            hoursSet.add(h);
          }
        }
      });
    });
    
    return hoursSet;
  };

  const hoursWithTasks = getHoursWithTasks();
  
  const getHourHeight = (hour: number): number => {
    return hoursWithTasks.has(hour) ? 140 : 50;
  };

  const getHourTop = (hour: number): number => {
    let top = 0;
    for (let h = 0; h < hour; h++) {
      top += getHourHeight(h);
    }
    return top;
  };

  const getTaskStyle = (task: Task, date: Date) => {
    if (!task.startDateTime || !task.endDateTime) {
      return { top: 0, height: 0 };
    }
    const taskStart = parseLocalDate(task.startDateTime);
    const taskEnd = parseLocalDate(task.endDateTime);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    let startHour = 0;
    let endHour = 24;

    if (taskStart >= dayStart && taskStart < dayEnd) {
      startHour = taskStart.getHours() + taskStart.getMinutes() / 60;
    }

    if (taskEnd >= dayStart && taskEnd < dayEnd) {
      endHour = taskEnd.getHours() + taskEnd.getMinutes() / 60;
    }

    const gap = 4;
    const startHourFloor = Math.floor(startHour);
    const endHourFloor = Math.floor(endHour);
    
    let top = getHourTop(startHourFloor);
    const minuteOffset = (startHour - startHourFloor) * getHourHeight(startHourFloor);
    top += minuteOffset + gap;

    let height = 0;
    for (let h = startHourFloor; h < endHourFloor && h < 24; h++) {
      const hourHeight = getHourHeight(h);
      if (h === startHourFloor && endHour - startHour <= 1) {
        height += (endHour - startHour) * hourHeight;
      } else if (h === startHourFloor) {
        height += (1 - (startHour - startHourFloor)) * hourHeight;
      } else {
        height += hourHeight;
      }
    }
    if (endHour > endHourFloor) {
      height += (endHour - endHourFloor) * getHourHeight(endHourFloor);
    }
    height -= gap * 2;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 80)}px`, 
      left: `${gap}px`,
      right: `${gap}px`,
    };
  };

  const getStatusColor = (status?: string) => {
    const colorMap: Record<string, string> = {
      TODO: '#9E9E9E',
      IN_PROGRESS: '#5B7FE8',
      DONE: '#4CAF50',
      FAILED: '#F44336',
    };
    return colorMap[status || 'TODO'] || '#5B7FE8';
  };

  const formatTime = (dateString: string): string => {
    const date = parseLocalDate(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getPriorityLabel = (priority?: string) => {
    const priorityMap: Record<string, string> = {
      LOW: '✓ Low',
      MEDIUM: '⚡ Medium',
      HIGH: '🔥 High',
    };
    return priorityMap[priority || 'MEDIUM'] || '⚡ Medium';
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Box sx={{ background: '#FFFFFF', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header z dniami tygodnia */}
      <Box sx={{ display: 'flex', borderBottom: '2px solid #E0E0E0' }}>
        {/* Kolumna na godziny */}
        <Box sx={{ width: 70, flexShrink: 0, borderRight: '2px solid #E0E0E0' }} />
        
        {/* Nagłówki dni */}
        {days.map((date, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              p: 2,
              textAlign: 'center',
              borderRight: index < 6 ? '1px solid #E0E0E0' : 'none',
              background: date.getDay() === 0 || date.getDay() === 6
                ? 'rgba(255, 245, 245, 0.6)'
                : isToday(date) ? '#F0F4FF' : 'transparent',
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
              {getDayName(date)}
            </Typography>
            <Typography sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: isToday(date) ? '#5B7FE8' : '#1a1a1a',
              mt: 0.5,
            }}>
              {date.getDate()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Timeline grid */}
      <Box sx={{ display: 'flex', position: 'relative' }}>
        {/* Kolumna godzin */}
        <Box sx={{ width: 70, flexShrink: 0, borderRight: '2px solid #E0E0E0' }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: getHourHeight(hour),
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                pr: 2,
                pt: 0.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
                {formatHour(hour)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Kolumny dni */}
        {days.map((date, dayIndex) => (
          <Box
            key={dayIndex}
            sx={{
              flex: 1,
              position: 'relative',
              borderRight: dayIndex < 6 ? '1px solid #E0E0E0' : 'none',
              background: date.getDay() === 0 || date.getDay() === 6 
                ? 'rgba(255, 245, 245, 0.5)' 
                : isToday(date) ? '#FAFBFF' : 'transparent',
            }}
          >
            {/* Linie godzin */}
            {hours.map((hour) => (
              <Box
                key={hour}
                sx={{
                  height: getHourHeight(hour),
                  borderBottom: '1px solid #E0E0E0',
                }}
              />
            ))}

            {/* Taski */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {getTasksForDay(date).map((task) => {
                if (!task.startDateTime || !task.endDateTime) return null;
                const taskDuration = (parseLocalDate(task.endDateTime).getTime() - parseLocalDate(task.startDateTime).getTime()) / (1000 * 60); // w minutach
                const isShortTask = taskDuration <= 30;

                return (
                  <Box
                    key={task.id}
                    onClick={() => onTaskClick?.(task.id)}
                    sx={{
                      position: 'absolute',
                      ...getTaskStyle(task, date),
                      background: 'rgba(248, 245, 255, 0.75)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `2px solid ${getStatusColor(task.status)}`,
                      borderRadius: 1.5,
                      p: 1.5,
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: isShortTask ? 'center' : 'space-between',
                      boxShadow: '0 2px 8px rgba(91, 127, 232, 0.08)',
                      '&:hover': {
                        background: 'rgba(240, 244, 255, 0.9)',
                        boxShadow: '0 4px 16px rgba(91, 127, 232, 0.15)',
                        transform: 'translateY(-1px)',
                        zIndex: 10,
                      },
                    }}
                  >
                    {isShortTask ? (
                      // Wersja dla krótkich tasków (≤30 min) - tylko tytuł i godzina
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 0.3,
                          }}
                        >
                          {task.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: '#666' }}>
                            🕐 {task.startDateTime && formatTime(task.startDateTime)} - {task.endDateTime && formatTime(task.endDateTime)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (

                      <>
                        {/* Górna część - Tytuł i Godziny */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#1a1a1a',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.3,
                              mb: 0.5,
                            }}
                          >
                            {task.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
                              🕐 {task.startDateTime && formatTime(task.startDateTime)} - {task.endDateTime && formatTime(task.endDateTime)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Dolna część - Priorytet i Kategorie */}
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.4,
                              borderRadius: 2,
                              background: getPriorityStyle((task as any).priority).bg,
                              border: `1.5px solid ${getPriorityStyle((task as any).priority).color}`,
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              color: getPriorityStyle((task as any).priority).color,
                            }}
                          >
                            {getPriorityLabel((task as any).priority)}
                          </Box>
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
                              {category.name || 'Category'}
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
