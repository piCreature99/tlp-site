import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(19, 87%, 56%)',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#fff',
    },
    secondary: {
      main: 'hsl(13, 72%, 45%)',
      dark: 'hsl(13, 72%, 35%)',
    },
    background: {
      // Logic: If dark mode, use deep charcoal; if light, use your Slate Blue
      default: '#f8fafc', 
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a' ,
      secondary: '#0f172a',
    },
  },
  shape: {
    borderRadius: 8,
  },
  // Adding this ensures MUI components like Cards use the new paper color properly
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes the default MUI elevation overlay in dark mode
        },
      },
    },
  },
});