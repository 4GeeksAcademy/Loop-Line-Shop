import { baseUrl, fetchWrapper } from './config';

// Obtener pedidos del usuario logueado
export const getOrders = async () => {
  return fetchWrapper(`${baseUrl}/orders`, {
    method: 'GET',
  });
};
