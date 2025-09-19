import { Routes, Route } from 'react-router-dom';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';
import OrderConfirmation from './pages/OrderConfirmation';
import { NavBar } from './components/NavBar';

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route element={<GuardedRoute />}>
          <Route element={<LayoutWithNavbar />}></Route>
          {routesConfig.map((route) => {
            return (
              <Route
                key={route.name}
                path={route.path}
                element={route.component}
              />
            );
          })}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Route>
      </Routes>
    </>
  );
};

const LayoutWithNavbar = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
