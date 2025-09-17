import axios from 'axios';

// URL base del backend (usa variable de entorno o fallback local)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper para leer cookies (para el CSRF token)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const checkoutOrder = async ({ address, payment_method }) => {
  try {
    const csrfToken = getCookie('csrf_access_token');

    const { data } = await axios.post(
      `${API_URL}/checkout`,
      { address, payment_method }, // ⚡ no se envía user_id, backend lo saca de JWT
      {
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}), // añade header CSRF si existe cookie
        },
        withCredentials: true, // 🔑 necesario para enviar cookies JWT al backend
      }
    );

    return data;
  } catch (error) {
    console.error(
      '❌ Error en checkoutOrder:',
      error.response?.data || error.message
    );
    throw error;
  }
};
