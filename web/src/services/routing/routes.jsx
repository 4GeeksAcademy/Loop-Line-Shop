import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import Cart from '../../components/Cart';
import Checkout from '../../pages/Checkout';
import { Miperfil } from '../../pages/Miperfil';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <Home />,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
  },
  {
    name: 'Miperfil',
    path: '/perfil',
    component: <Miperfil />,
  },
  {
    name: 'Carrito',
    path: '/cart',
    component: <Cart />,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    component: <Checkout />,
  },
  {
    name: 'All',
    path: '*',
    component: <Home />,
  },
];
