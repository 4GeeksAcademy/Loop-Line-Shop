import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Container,
  Paper,
  Box,
} from '@mui/material';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center', color: '#fff' }}>
        <Typography variant="h6" gutterBottom>
          ⚠️ No hay datos de pedido para mostrar.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: '#D7FF00',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#c6f500' },
          }}
          onClick={() => navigate('/orders')}
        >
          Ver mis pedidos
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 6,
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
          maxWidth: 700,
          boxShadow: '0 0 25px rgba(215,255,0,0.4)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#D7FF00', fontWeight: 'bold', textAlign: 'center' }}
        >
          ✅ Pedido confirmado
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Pedido #{order.id}
        </Typography>
        <Typography variant="body2">
          Fecha: {new Date(order.created_at).toLocaleString()}
        </Typography>
        <Typography>Dirección: {order.address}</Typography>
        <Typography>Método de pago: {order.payment_method}</Typography>
        <Typography sx={{ mt: 2, color: '#D7FF00' }} variant="h6">
          Total: ${order.total}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#D7FF00' }} />

        <Typography variant="h5" gutterBottom sx={{ color: '#D7FF00' }}>
          Resumen de productos:
        </Typography>
        <List>
          {order.items.map((item) => (
            <div key={item.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={item.image} alt={item.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.name} x ${item.quantity}`}
                  secondary={`$${item.unit_price} c/u — Subtotal: $${item.subtotal}`}
                />
              </ListItem>
              <Divider sx={{ borderColor: 'rgba(215,255,0,0.2)' }} />
            </div>
          ))}
        </List>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#D7FF00',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#c6f500' },
            }}
            onClick={() => navigate('/orders')}
          >
            Ver mis pedidos
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#D7FF00',
              color: '#D7FF00',
              fontWeight: 'bold',
              '&:hover': { borderColor: '#c6f500', color: '#c6f500' },
            }}
            onClick={() => navigate('/')}
          >
            Volver a la tienda
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
