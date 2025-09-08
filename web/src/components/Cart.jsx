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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // 🗑️ icono de borrar
import { UserContext } from '../context/User';
import { getCart, deleteCartItem } from '../services/api/cart';

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState({ items: [], total: 0 });

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

  // 🗑️ handler borrar item
  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      fetchCart(); // refrescar carrito tras borrar
    } catch (err) {
      console.error('Error eliminando producto:', err);
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
                primary={`${item.name} x ${item.quantity}`}
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
    </div>
  );
}
