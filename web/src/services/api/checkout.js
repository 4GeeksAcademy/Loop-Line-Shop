import { baseUrl, fetchWrapper } from './config';

// POST: crear pedido
export const checkoutOrder = async ({ address, payment_method }) => {
  return fetchWrapper(`${baseUrl}/checkout`, {
    method: 'POST',
    body: JSON.stringify({ address, payment_method }),
  });
};
