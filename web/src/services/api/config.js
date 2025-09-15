export const baseUrl = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

export const usersUrl = 'users/';

export const fetchWrapper = async (input, init) => {
  return await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': sessionStorage.getItem('csrf_access_token') || '',
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
      return error;
    });
};
