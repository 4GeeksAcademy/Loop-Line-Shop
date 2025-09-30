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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Función reutilizable para traer al user logueado
  const refreshUser = async () => {
    try {
      const csrf = sessionStorage.getItem('csrf_access_token');
      const res = await fetch(`${baseUrl}/me`, {
        credentials: 'include', // ✅ incluye cookies
        headers: { 'X-CSRF-TOKEN': csrf || '' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.email) {
          setUser(data);
        } else {
          setUser({});
        }
      } else {
        setUser({});
      }
    } catch (err) {
      console.error('❌ Error al refrescar user:', err);
      setUser({});
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Refrescar user si hay cookie al montar la app
  useEffect(() => {
    refreshUser();
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const data = await postLogin(email, password);

      if (data?.csrf_token) {
        sessionStorage.setItem('csrf_access_token', data.csrf_token);
      }

      if (data?.user) {
        setUser(data.user);
        // ✅ refrescar desde /me para asegurar datos actuales
        await refreshUser();
        navigate('/'); // redirige a home
      } else {
        console.error('❌ Login fallido:', data);
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await postLogout();
      setUser({});
      sessionStorage.removeItem('csrf_access_token');
      navigate('/login');
    } catch (err) {
      console.error('❌ Error en logout:', err);
    }
  };

  // 🔹 Register
  const register = async (user_name, email, password) => {
    try {
      await postRegister(user_name, email, password);
      // ✅ Después de registrarse, login automático
      await login(email, password);
    } catch (err) {
      console.error('❌ Error en registro:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </UserContext.Provider>
  );
};
