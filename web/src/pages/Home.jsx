import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Grid2, Typography } from '@mui/material';
import { getProducts } from '../services/api/product';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((listaApi) => {
      setProducts(listaApi);
    });
  }, []);

  return (
    <>
      <div>
        <Typography variant="h4" gutterBottom>
          Produtos
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 size={2}></Grid2>
          <Grid2 item size={8}>
            {products.map((product) => (
              <Grid2 xs={3} item key={product.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height={140}
                    image={product.images[0]}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>
                      {product.title} {product.price}€
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
          <Grid2 size={2}></Grid2>
        </Grid2>
      </div>
    </>
  );
}
