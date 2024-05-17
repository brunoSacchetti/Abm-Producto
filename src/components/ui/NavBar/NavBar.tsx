import { IconButton, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from '@mui/icons-material/Menu';

/* export const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <h2>MasterDetail</h2>
        </Toolbar>
      </AppBar>
    </Box>
  );
}; */

export const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#f09e2f' }}>
        <Toolbar>
          <IconButton 
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ARTICULO MANUFACTURADO
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
