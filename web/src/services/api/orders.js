import { baseUrl, fetchWrapper } from './config';

// Obtener pedidos del usuario logueado
export const getOrders = async () => {
  return fetchWrapper(`${baseUrl}/api/orders`, {
    method: 'GET',
  });
};
