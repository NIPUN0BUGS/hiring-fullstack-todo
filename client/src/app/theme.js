import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#396ee8', dark: '#2859c7', light: '#edf3ff' },
    success: { main: '#299b72' },
    warning: { main: '#d99936' },
    error: { main: '#c94f59' },
    background: { default: '#f4f6fb', paper: '#ffffff' },
    text: { primary: '#19263a', secondary: '#8490a3' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"DM Sans", "Roboto", Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9, boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { backgroundImage: 'none' },
      },
    },
  },
});
