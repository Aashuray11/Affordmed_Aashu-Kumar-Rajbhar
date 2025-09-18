import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import { theme } from './theme.js'
import ShortenerPage from './pages/ShortenerPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
export default function App(){
  return <ThemeProvider theme={theme}> <CssBaseline/> <NavBar/> <Container maxWidth="lg" sx={{ py:4 }}> <Box> <Routes> <Route path="/" element={<ShortenerPage/>}/> <Route path="/stats" element={<StatsPage/>}/> </Routes> </Box> </Container> </ThemeProvider>
}