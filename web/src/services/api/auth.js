import { baseUrl, fetchWrapper } from './config';

export const postRegister = async (username, email, password) => {
  return await fetchWrapper(`${baseUrl}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_name: username,
      email: email,
      password: password,
    }),
  }).then((data) => {
    return data;
  });
};

export const postLogin = async (email, password) => {
  return await fetchWrapper(`${baseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((data) => {
    sessionStorage.setItem('csrf_access_token', data.csrf_token);
    return data;
  });
};

export const postLogout = async () => {
  return await fetchWrapper(`${baseUrl}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    return data;
  });
};
