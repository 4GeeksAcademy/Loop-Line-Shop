import { useContext, useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import { UserContext } from '../context/User';
import { getCart } from '../services/api/cart';
import { checkoutOrder } from '../services/api/checkout';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const data = await getCart(user.id);
          setCart(data);
        } catch (err) {
          console.error('Error cargando carrito:', err);
        }
      })();
    }
  }, [user]);

  const handleConfirmOrder = async () => {
    try {
      const order = await checkoutOrder(user.id);
      setMessage(`🎉 Pedido #${order.id} creado con éxito por $${order.total}`);
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error('Error en checkout:', err);
      setMessage('❌ Error al procesar el pedido.');
    }
  };

  if (!user?.id) {
    return (
      <Typography variant="h6">
        Debes iniciar sesión para confirmar tu pedido
      </Typography>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <List>
        {cart.items.map((item) => (
          <div key={item.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={item.image} alt={item.name} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.name} x ${item.quantity}`}
                secondary={`Subtotal: $${item.subtotal}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Typography variant="h5" sx={{ marginTop: '1rem' }}>
        Total: ${cart.total}
      </Typography>

      {cart.items.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ marginTop: '1.5rem' }}
          fullWidth
          onClick={handleConfirmOrder}
        >
          Confirmar pedido
        </Button>
      )}

      {message && (
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      )}
    </div>
  );
}
