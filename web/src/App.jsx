import { Routes, Route, Outlet } from 'react-router-dom';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';
import OrderConfirmation from './pages/OrderConfirmation';
import { NavBar } from './components/NavBar';
import Orders from './pages/Orders';
import Register from './pages/Register';

export const App = () => {
  return (
    <div className="app-content">
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route element={<GuardedRoute />}>
          <Route element={<LayoutWithNavbar />}>
            {routesConfig.map((route) => (
              <Route
                key={route.name}
                path={route.path}
                element={route.component}
              />
            ))}

            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

const LayoutWithNavbar = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
