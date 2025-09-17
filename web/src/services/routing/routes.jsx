import Home from '../../pages/Home';
import { Login } from '../../pages/Login';
import Cart from '../../components/Cart';
import Checkout from '../../pages/Checkout';
import OrderConfirmation from '../../pages/OrderConfirmation';

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
    name: 'OrderConfirmation',
    path: '/order-confirmation',
    component: <OrderConfirmation />,
  },
  {
    name: 'All',
    path: '*',
    component: <Home />,
  },
];
