import { Box, Typography, Chip } from '@mui/material';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onAddCategory?: () => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, onAddCategory }: CategoryFilterProps) => {
  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#333', 
          fontWeight: 600,
          mb: 2,
        }}
      >
        Categories
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => onSelectCategory(null)}
          sx={{
            minWidth: 120,
            height: 100,
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 3,
            background: selectedCategory === null ? '#4A90E2' : '#FFFFFF',
            border: '1px solid #E0E0E0',
            color: selectedCategory === null ? '#FFFFFF' : '#666',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              background: selectedCategory === null ? '#3A7BC8' : '#F5F5F5',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        />
        
        {onAddCategory && (
          <Chip
            label="+"
            onClick={onAddCategory}
            sx={{
              minWidth: 120,
              height: 100,
              fontSize: '2rem',
              fontWeight: 300,
              borderRadius: 3,
              background: '#FFFFFF',
              border: '2px dashed #4A90E2',
              color: '#4A90E2',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                background: '#F0F4FF',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          />
        )}
        
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => onSelectCategory(category.id)}
            sx={{
              minWidth: 120,
              height: 100,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 3,
              background: selectedCategory === category.id ? '#4A90E2' : '#FFFFFF',
              border: '1px solid #E0E0E0',
              color: selectedCategory === category.id ? '#FFFFFF' : '#666',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                background: selectedCategory === category.id ? '#3A7BC8' : '#F5F5F5',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
