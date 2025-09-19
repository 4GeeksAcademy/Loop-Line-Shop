import { createContext, useState, useEffect } from 'react';
import { postLogin, postLogout, postRegister } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../services/api/config';

export const UserContext = createContext({
  user: {},
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseUrl}/me`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error('❌ Error en /me:', err);
      });
  }, []);

  const login = (email, password) => {
    postLogin(email, password).then((data) => {
      console.log('✅ Login response:', data);

      if (data?.csrf_token) {
        sessionStorage.setItem('csrf_access_token', data.csrf_token);
      }
      setUser(data.user);
      navigate('/');
    });
  };

  const logout = () => {
    postLogout().then(() => {
      setUser({});
      navigate('/login');
    });
  };

  const register = (username, email, password) => {
    postRegister(username, email, password).then(() => {
      login(email, password);
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};
