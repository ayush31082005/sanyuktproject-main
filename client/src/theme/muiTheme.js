import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#C8A96A' },
    secondary: { main: '#D4AF37' },
    background: {
      default: '#0D0D0D',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#F5E6C8',
      secondary: 'rgba(245, 230, 200, 0.72)',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#0D0D0D' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(200, 169, 106, 0.15)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(200, 169, 106, 0.15)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 800 },
        containedPrimary: {
          color: '#0D0D0D',
          background: 'linear-gradient(90deg, #C8A96A 0%, #D4AF37 100%)',
        },
        outlinedPrimary: {
          borderColor: 'rgba(200, 169, 106, 0.45)',
          color: '#C8A96A',
        },
        textPrimary: { color: '#C8A96A' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200, 169, 106, 0.25)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200, 169, 106, 0.45)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C8A96A' },
        },
        input: { color: '#F5E6C8' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontWeight: 900 },
      },
    },
  },
});

export default muiTheme;

