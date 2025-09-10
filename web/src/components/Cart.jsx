import { useContext, useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../context/User';
import { getCart, deleteCartItem, updateCartItem } from '../services/api/cart';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const navigate = useNavigate();

  // 🔄 función para recargar el carrito
  const fetchCart = async () => {
    if (user?.id) {
      try {
        const data = await getCart(user.id);
        setCart(data);
      } catch (err) {
        console.error('Error cargando carrito:', err);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // 🗑️ borrar item
  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      fetchCart();
    } catch (err) {
      console.error('Error eliminando producto:', err);
    }
  };

  // 🔄 actualizar cantidad
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      fetchCart();
    } catch (err) {
      console.error('Error actualizando cantidad:', err);
    }
  };

  if (!user?.id) {
    return (
      <Typography variant="h6">
        Debes iniciar sesión para ver tu carrito
      </Typography>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h4" gutterBottom>
        Mi Carrito
      </Typography>
      <List>
        {cart.items.map((item) => (
          <div key={item.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={item.image} alt={item.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{item.name}</span>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                }
                secondary={`Precio unitario: $${item.price} | Subtotal: $${item.subtotal}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Typography variant="h5" sx={{ marginTop: '1rem' }}>
        Total: ${cart.total}
      </Typography>

      {/* 🚀 Botón para ir al checkout */}
      {cart.items.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: '1.5rem' }}
          fullWidth
          onClick={() => navigate('/checkout')}
        >
          Proceder al Checkout
        </Button>
      )}
    </div>
  );
}
