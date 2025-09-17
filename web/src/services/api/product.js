import { baseUrl, fetchWrapper } from './config';

export const getProducts = async () => {
  return await fetchWrapper(`${baseUrl}/products`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    return data;
  });
};
