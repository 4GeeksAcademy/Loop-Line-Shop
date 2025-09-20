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
} from '@mui/material';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          ⚠️ No hay datos de pedido para mostrar.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Ver mis pedidos
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          ✅ Pedido confirmado
        </Typography>
        <Typography variant="h6">Pedido #{order.id}</Typography>
        <Typography variant="body2">
          Fecha: {new Date(order.created_at).toLocaleString()}
        </Typography>
        <Typography>Dirección: {order.address}</Typography>
        <Typography>Método de pago: {order.payment_method}</Typography>
        <Typography sx={{ mt: 2 }} variant="h6">
          Total: ${order.total}
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" gutterBottom>
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
              <Divider />
            </div>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate('/orders')}
        >
          Ver mis pedidos
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Volver a la tienda
        </Button>
      </Paper>
    </Container>
  );
}
