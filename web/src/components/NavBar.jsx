import { useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import { NavLink } from 'react-router';
import {
  AppBar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { UserContext } from '../context/User';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink to={'/'}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              {' '}
              {/* ⚠️ aquí luego lo enlazamos con el estado real del carrito */}
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </NavLink>
        {user.user_name}
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
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
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
