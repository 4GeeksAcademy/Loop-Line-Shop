import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
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
    path: '/Miperfil',
    component: <Miperfil />,
  },

  {
    name: 'All',
    path: '*',
    component: <Home />,
  },
];
