import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Button,
  Divider,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserContext } from '../context/User';
import { CartContext } from '../context/Cart';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const { cart } = useContext(CartContext);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo / Home */}
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛍️ Loop&Line Shop
          </Typography>
        </NavLink>

        {/* Carrito */}
        <NavLink to="/cart" style={{ color: 'inherit' }}>
          <IconButton color="inherit">
            <Badge badgeContent={cart?.items?.length || 0} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </NavLink>
        {/* Menú de usuario */}
        <NavLink to="/Miperfil"></NavLink>
        {user && user.user_name ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.user_name}
            </Typography>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={NavLink} to="/orders" onClick={handleClose}>
                My Orders
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <NavLink
            to="/login"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Button color="inherit">Login</Button>
          </NavLink>
        )}
      </Toolbar>
    </AppBar>
  );
};
