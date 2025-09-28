import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
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
        <Grid container spacing={3}>
          <Grid xs={2}></Grid>
          <Grid xs={8}>
            {products.map((product) => (
              <Grid xs={3} key={product.id}>
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
              </Grid>
            ))}
          </Grid>
          <Grid size={2}></Grid>
        </Grid>
      </div>
    </>
  );
}
