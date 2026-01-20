import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <TextField
      fullWidth
      placeholder="Wyszukaj task po nazwie..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#999999' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          background: '#F5F5F5',
          fontSize: '1rem',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            background: '#EEEEEE',
          },
          '&.Mui-focused': {
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
        '& input::placeholder': {
          color: '#999999',
          opacity: 1,
        },
      }}
    />
  );
};
