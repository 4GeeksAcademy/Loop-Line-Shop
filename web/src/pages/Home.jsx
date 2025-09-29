import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { getProducts } from '../services/api/product';
import { CartContext } from '../context/Cart';
import { Carousel } from 'react-responsive-carousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [openProduct, setOpenProduct] = useState(null);

  useEffect(() => {
    getProducts().then((listaApi) => {
      setProducts(listaApi);
    });
  }, []);

  return (
    <>
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#D7FF00', fontWeight: 'bold', textAlign: 'center' }}
        >
          Produtos
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Paper
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  color: '#fff',
                  border: '2px solid #D7FF00',
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                  boxShadow: '0 0 20px rgba(215,255,0,0.3)',
                }}
              >
                <CardMedia
                  component="img"
                  height={180}
                  image={product.images[0]}
                  sx={{ borderRadius: 2, mb: 2 }}
                  onClick={() => setOpenProduct(product)}
                />
                <Typography variant="h6" sx={{ color: '#D7FF00', mb: 1 }}>
                  {product.title}
                </Typography>
                <Divider sx={{ color: '#D7FF00', my: 1 }} />
                <Typography variant="subtitle1" sx={{ color: '#D7FF00' }}>
                  {product.price}€
                </Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => addToCart(product.id, 1)}
                    >
                      Añadir al carrito
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ color: '#D7FF00', borderColor: '#D7FF00' }}
                      onClick={() => setOpenProduct(product)}
                    >
                      Ver detalles
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Modal de detalle */}
        {openProduct && (
          <Dialog
            open={!!openProduct}
            onClose={() => setOpenProduct(null)}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(0,0,0,0.9)',
                color: '#fff',
                border: '2px solid #D7FF00',
                borderRadius: 3,
                p: 3,
                mb: 3,
                boxShadow: '0 0 20px rgba(215,255,0,0.3)',
              },
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <Grid container spacing={2}>
                {/* Carousel de imágenes */}
                <Grid item xs={12} md={6}>
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={false}
                    emulateTouch
                    swipeable
                    infiniteLoop
                  >
                    {openProduct.images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={img}
                          alt={`${openProduct.title} ${index + 1}`}
                          style={{
                            width: '100%',
                            maxHeight: 350,
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Grid>

                {/*Información producto */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#D7FF00', mb: 2 }}>
                    {openProduct.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#D7FF00', mb: 2 }}>
                    {openProduct.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: '#D7FF00', mb: 1 }}
                  >
                    Precio: {openProduct.price}€
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      addToCart(openProduct.id, 1);
                      setOpenProduct(null);
                    }}
                  >
                    Añadir al carrito
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </>
  );
}
