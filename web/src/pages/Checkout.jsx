import { useContext, useState } from 'react';
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
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { UserContext } from '../context/User';
import { CartContext } from '../context/Cart';
import { checkoutOrder } from '../services/api/checkout';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const { cart, clearCart, fetchCart } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmOrder = async () => {
    if (!address || !paymentMethod) {
      setSnackbar({
        open: true,
        message: '⚠️ Completa dirección y método de pago',
        severity: 'warning',
      });
      return;
    }

    try {
      const order = await checkoutOrder({
        address,
        payment_method: paymentMethod,
      });

      // Limpia carrito del contexto
      +(await clearCart());

      setSnackbar({
        open: true,
        message: `🎉 Pedido #${order.id} creado con éxito por $${order.total}`,
        severity: 'success',
      });

      // Redirigir a OrderConfirmation
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      console.error('❌ Error checkout:', err);
      setSnackbar({
        open: true,
        message: '❌ Error al procesar el pedido',
        severity: 'error',
      });
    }
  };

  if (!user?.id) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        Debes iniciar sesión para confirmar tu pedido
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '2rem auto' }}>
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

      <Typography variant="h5" sx={{ mt: 2 }}>
        Total: ${cart.total || 0}
      </Typography>

      {/* Dirección */}
      <TextField
        label="Dirección de envío"
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ mt: 2 }}
      />

      {/* Método de pago */}
      <FormControl fullWidth sx={{ mt: 2 }}>
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
          sx={{ mt: 3 }}
          fullWidth
          onClick={handleConfirmOrder}
        >
          Confirmar pedido
        </Button>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
