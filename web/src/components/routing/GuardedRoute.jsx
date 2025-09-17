import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/User';
import { isEmpty } from 'lodash';

export const GuardedRoute = () => {
  const { user } = useContext(UserContext);
  return !isEmpty(user) ? <Outlet /> : <Navigate to="/login" />;
};
