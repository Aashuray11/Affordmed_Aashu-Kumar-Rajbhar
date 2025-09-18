import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
export default function NavBar(){
  const { pathname } = useLocation()
  return <AppBar position="sticky" color="primary" elevation={3}>
    <Toolbar sx={{ gap: 2 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>Shorten</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button component={Link} to="/" variant={pathname==='/'?'contained':'text'} color="secondary">Shorten URL</Button>
        <Button component={Link} to="/stats" variant={pathname==='/stats'?'contained':'text'} color="secondary">Statistics</Button>
      </Box>
    </Toolbar>
  </AppBar>
}