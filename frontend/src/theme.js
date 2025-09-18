import { createTheme } from '@mui/material/styles'
export const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#1565c0' }, secondary: { main: '#ff6d00' }, background: { default: '#f5f7fa', paper: '#ffffff' } },
  shape: { borderRadius: 14 },
  typography: { fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', h6: { fontWeight: 600 } },
  components: { MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } } }, MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } } }
})