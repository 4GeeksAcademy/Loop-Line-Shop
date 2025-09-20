import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { getOrders } from '../services/api/orders';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error('❌ Error cargando pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>No tienes pedidos todavía 🛍️</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis pedidos
      </Typography>
      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Pedido #{order.id}</Typography>
          <Typography variant="body2">
            Fecha: {new Date(order.created_at).toLocaleString()}
          </Typography>
          <Typography>Dirección: {order.address}</Typography>
          <Typography>Método de pago: {order.payment_method}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Total: ${order.total}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <List dense>
            {order.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar src={item.image} alt={item.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.name} x${item.quantity}`}
                  secondary={`$${item.unit_price} c/u — Subtotal: $${item.subtotal}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Container>
  );
}
