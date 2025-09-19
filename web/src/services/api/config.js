export const baseUrl = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

export const fetchWrapper = async (input, init = {}) => {
  const csrf = sessionStorage.getItem('csrf_access_token') || '';
  const token = localStorage.getItem('token');

  return await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText || response.status);
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('❌ fetchWrapper error:', error);
      throw error;
    });
};
