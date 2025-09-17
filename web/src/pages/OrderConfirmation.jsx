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
} from '@mui/material';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <Typography variant="h6" sx={{ marginTop: '2rem', textAlign: 'center' }}>
        ⚠️ No hay datos de pedido para mostrar.
      </Typography>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Pedido confirmado
      </Typography>

      <Typography variant="h6" gutterBottom>
        Número de pedido: #{order.id}
      </Typography>

      <Typography variant="body1" gutterBottom>
        Dirección de envío: <strong>{order.address}</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Método de pago: <strong>{order.payment_method}</strong>
      </Typography>

      <Divider sx={{ margin: '1rem 0' }} />

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

      <Typography variant="h5" sx={{ marginTop: '1rem' }}>
        Total: ${order.total}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: '2rem' }}
        onClick={() => navigate('/')}
      >
        Volver a la tienda
      </Button>
    </div>
  );
}
