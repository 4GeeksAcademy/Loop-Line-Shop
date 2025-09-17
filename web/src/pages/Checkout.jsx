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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { UserContext } from '../context/User';
import { getCart } from '../services/api/cart';
import { checkoutOrder } from '../services/api/checkout';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const data = await getCart(user.id);
          setCart(data);
        } catch (err) {
          console.error('❌ Error cargando carrito:', err);
        }
      })();
    }
  }, [user]);

  const handleConfirmOrder = async () => {
    if (!address || !paymentMethod) {
      setMessage('⚠️ Completa dirección y método de pago');
      return;
    }

    try {
      const order = await checkoutOrder({
        address,
        payment_method: paymentMethod,
      });
      setMessage(`🎉 Pedido #${order.id} creado con éxito por $${order.total}`);
      setCart({ items: [], total: 0 });
      setAddress('');
      setPaymentMethod('');
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
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

      {/* Carrito */}
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

      {/* Dirección */}
      <TextField
        label="Dirección de envío"
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ marginTop: '1rem' }}
      />

      {/* Método de pago */}
      <FormControl fullWidth sx={{ marginTop: '1rem' }}>
        <InputLabel id="payment-method-label">Método de pago</InputLabel>
        <Select
          labelId="payment-method-label"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="">Selecciona método</MenuItem>
          <MenuItem value="credit_card">Tarjeta</MenuItem>
          <MenuItem value="paypal">PayPal</MenuItem>
          <MenuItem value="bank_transfer">Transferencia</MenuItem>
        </Select>
      </FormControl>

      {/* Botón confirmar */}
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

      {/* Mensajes */}
      {message && (
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      )}
    </div>
  );
}
