import { baseUrl, fetchWrapper } from './config';

// Registro
export const postRegister = async (username, email, password) => {
  return fetchWrapper(`${baseUrl}/api/register`, {
    method: 'POST',
    body: JSON.stringify({ user_name: username, email, password }),
  });
};

// Login
export const postLogin = async (email, password) => {
  return fetchWrapper(`${baseUrl}/api/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    if (data?.acces_token) {
      //sessionStorage.setItem("csrf_access_token", data.csrf_token);
      localStorage.setItem('token', data.access_token);
    }
    return data;
  });
};

// Logout
export const postLogout = async () => {
  return fetchWrapper(`${baseUrl}/api/logout`, {
    method: 'POST',
  });
};
