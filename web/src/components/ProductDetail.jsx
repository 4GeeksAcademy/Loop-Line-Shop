import { useContext } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { UserContext } from '../context/User';
import { addToCart } from '../services/api/cart';

export default function ProductDetail({ product }) {
  const { user } = useContext(UserContext);

  const handleAddToCart = async () => {
    try {
      if (!user?.id) {
        alert('Debes iniciar sesión para añadir al carrito');
        return;
      }

      await addToCart(user.id, product.id, 1);
      alert('Producto añadido al carrito 🚀');
    } catch (err) {
      console.error('Error al añadir al carrito', err);
      alert('Error al añadir producto');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: '1rem auto' }}>
      <CardContent>
        <Typography variant="h5">{product.title}</Typography>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
        />
        <Typography variant="body1">Precio: ${product.price}</Typography>
        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="primary"
          sx={{ marginTop: '1rem' }}
        >
          Añadir al carrito
        </Button>
      </CardContent>
    </Card>
  );
}
