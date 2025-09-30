import { baseUrl, fetchWrapper } from './config';

// Registro
export const postRegister = async (username, email, password) => {
  return fetchWrapper(`${baseUrl}/register`, {
    method: 'POST',
    body: JSON.stringify({ user_name: username, email, password }),
  });
};

// Login
export const postLogin = async (email, password) => {
  return fetchWrapper(`${baseUrl}/login`, {
    method: 'POST',
    //sheaders: {"Access-Control-Allow-Origin":"*"},
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    if (data?.access_token) {
      sessionStorage.setItem('csrf_access_token', data.csrf_token);
      //localStorage.setItem('token', data.access_token);
    }
    return data;
  });
};

// Logout
export const postLogout = async () => {
  return fetchWrapper(`${baseUrl}/logout`, {
    method: 'POST',
  });
};
