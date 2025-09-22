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

  // 🔹 Función reutilizable para traer al user logeado
  const refreshUser = () => {
    const csrf = sessionStorage.getItem('csrf_access_token');
    return fetch(`${baseUrl}/api/me`, {
      credentials: 'include',
      headers: { 'X-CSRF-TOKEN': csrf || '' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) {
          setUser(data);
        } else {
          setUser({});
        }
      })
      .catch(() => setUser({}));
  };

  // 🔹 Solo refrescar user si ya hay cookie al montar la app
  useEffect(() => {
    const csrf = sessionStorage.getItem('csrf_access_token');
    if (csrf) {
      refreshUser();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await postLogin(email, password);

      if (data?.csrf_token) {
        sessionStorage.setItem('csrf_access_token', data.csrf_token);
      }

      if (data?.user) {
        setUser(data.user);
        sessionStorage.setItem('user_id', data.user.id);
        // ✅ Después de login exitoso refrescamos desde /me
        await refreshUser();
        navigate('/');
      } else {
        console.error('❌ Login fallido:', data);
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
    }
  };

  const logout = () => {
    postLogout().then(() => {
      setUser({});
      sessionStorage.removeItem('csrf_access_token');
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
