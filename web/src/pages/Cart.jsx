import { useContext } from 'react';
import { CartContext } from '../context/Cart';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🛒 Your Cart
      </Typography>

      {cart.items && cart.items.length > 0 ? (
        <>
          <List>
            {cart.items.map((item) => (
              <div key={item.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Botón - */}
                      <IconButton
                        edge="end"
                        aria-label="decrease"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(item.quantity - 1, 1)
                          )
                        }
                      >
                        <RemoveIcon />
                      </IconButton>

                      <Typography>{item.quantity}</Typography>

                      {/* Botón + */}
                      <IconButton
                        edge="end"
                        aria-label="increase"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon />
                      </IconButton>

                      {/* Botón remove */}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 60, borderRadius: 8 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Price: $${item.unit_price} | Subtotal: $${item.subtotal}`}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Typography variant="h6">Total: ${cart.total || 0}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{ mt: 2, mr: 2 }}
            >
              Clear Cart
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => alert('Checkout flow next 🚀')}
            >
              Checkout
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6">Your cart is empty 🛍️</Typography>
      )}
    </Container>
  );
};

export default Cart;
