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
  Snackbar,
  Alert,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import { UserContext } from '../context/User';
import { CartContext } from '../context/Cart';
import { checkoutOrder } from '../services/api/checkout';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { user } = useContext(UserContext);
  const { cart, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!address) {
      setSnackbar({
        open: true,
        message: '⚠️ Completa dirección de envío',
        severity: 'warning',
      });
      return;
    }

    try {
      setLoading(true);

      // ⏳ Simular espera de pasarela
      await new Promise((res) => setTimeout(res, 1500));

      const order = await checkoutOrder({
        address,
        payment_method: 'credit_card', // 🔥 hardcodeado
      });

      await clearCart();

      setSnackbar({
        open: true,
        message: `🎉 Pedido #${order.id} creado con éxito por $${order.total}`,
        severity: 'success',
      });

      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      console.error('❌ Error checkout:', err);
      setSnackbar({
        open: true,
        message: '❌ Error al procesar el pedido',
        severity: 'error',
      });
    } finally {
      setLoading(false);
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 4,
      }}
    >
      <Paper
        sx={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: '#fff',
          border: '2px solid #D7FF00',
          borderRadius: 3,
          p: 4,
          width: '100%',
          maxWidth: 600,
          boxShadow: '0 0 25px rgba(215,255,0,0.4)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#D7FF00', fontWeight: 'bold', textAlign: 'center' }}
        >
          Checkout
        </Typography>

        {/* 🛒 Carrito */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Carrito
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
                  sx={{ color: '#D7FF00' }}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <Typography variant="h5" sx={{ mt: 2, color: '#D7FF00' }}>
          Total: ${cart.total || 0}
        </Typography>

        {/* 🚚 Dirección */}
        <TextField
          label="Dirección de envío"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{
            mt: 3,
            input: { color: '#fff' },
            label: { color: '#D7FF00' },
            '& .MuiOutlinedInput-root fieldset': { borderColor: '#D7FF00' },
          }}
        />

        {/* ✅ Confirmar */}
        {cart.items.length > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmOrder}
            disabled={loading}
            sx={{
              mt: 4,
              bgcolor: '#D7FF00',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#c6f500' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Confirmar pedido'
            )}
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
      </Paper>
    </Box>
  );
}
