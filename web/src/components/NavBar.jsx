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
  Box,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserContext } from '../context/User';
import { CartContext } from '../context/Cart';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const { cart } = useContext(CartContext);

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

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo / Home */}
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/logotipo_loop.png"
              alt="Loop&Line Logo"
              style={{ height: '40px' }}
            />
            <Typography
              variant="h6"
              sx={{ color: '#D7FF00', fontWeight: 'bold', letterSpacing: 1 }}
            >
              Loop&Line Shop
            </Typography>
          </Box>
        </NavLink>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Carrito → solo mostrar si hay user logeado */}
          {user?.id && (
            <NavLink to="/cart" style={{ color: 'inherit' }}>
              <IconButton>
                <Badge
                  badgeContent={cart?.items?.length || 0}
                  color="secondary"
                >
                  <ShoppingCartIcon sx={{ color: '#D7FF00' }} />
                </Badge>
              </IconButton>
            </NavLink>
          )}

          {/* Menú de usuario */}
          {user && user.user_name ? (
            <>
              <Typography
                variant="body1"
                sx={{ color: '#fff', marginRight: 1 }}
              >
                {user.user_name}
              </Typography>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: '#D7FF00' }}
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
                PaperProps={{
                  sx: {
                    backgroundColor: '#000000',
                    color: '#D7FF00',
                    border: '1px solid #D7FF00',
                  },
                }}
              >
                <MenuItem
                  component={NavLink}
                  to="/orders"
                  onClick={handleClose}
                  sx={{
                    border: '1px solid #D7FF00',
                    borderRadius: '4px',
                    margin: '4px 8px',
                  }}
                >
                  My Orders
                </MenuItem>
                <Divider sx={{ bgcolor: '#D7FF00' }} />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <NavLink
              to="/login"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Button
                sx={{
                  color: '#D7FF00',
                  border: '1px solid #D7FF00',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#D7FF00',
                    color: '#000000',
                  },
                }}
              >
                Login
              </Button>
            </NavLink>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
