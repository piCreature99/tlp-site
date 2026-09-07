import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(19, 87%, 56%)',      // Terracotta Orange
      light: 'hsl(19, 87%, 66%)',     // Soft Warm Orange
      dark: 'hsl(19, 87%, 46%)',      // Rich Burnt Orange
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(13, 72%, 45%)',      // Crimson / Sienna
      dark: 'hsl(13, 72%, 35%)',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',             // Ultra-light Slate
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',             // Dark Slate (Headers)
      secondary: '#475569',           // Muted Slate (Descriptions/Labels)
    },
  },
  shape: {
    borderRadius: 8,                  // 8px default scaling matches your tokens
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',       // Gives a cleaner, modern tech look over all-caps
          borderRadius: 8,             // Pulls explicitly from shape.borderRadius
        },
      },
    },
  },
});