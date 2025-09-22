import { useContext } from 'react';
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../context/Cart';
import { useNavigate } from 'react-router-dom';

export default function Cart({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 350,
          bgcolor: '#000',
          color: '#D7FF00',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">My Cart</Typography>
          <IconButton onClick={onClose} sx={{ color: '#D7FF00' }}>
            ✕
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: '#D7FF00' }} />

        {/* Cart Items */}
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  bgcolor: '#111',
                  borderRadius: '8px',
                  mb: 1,
                  px: 2,
                  py: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFromCart(item.id)}
                    sx={{ color: '#D7FF00' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Avatar
                  src={item.image}
                  alt={item.name}
                  sx={{ marginRight: 2 }}
                />
                <ListItemText
                  primary={
                    <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {item.name} x{item.quantity}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: '#D7FF00', fontWeight: 'bold' }}>
                      ${item.subtotal}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 2 }}>Your cart is empty</Typography>
          )}
        </List>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #D7FF00' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total: ${cart.total}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            sx={{
              bgcolor: '#D7FF00',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#c6f500' },
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
