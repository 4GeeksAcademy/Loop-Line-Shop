import { baseUrl, fetchWrapper } from './config';

// GET: obtener carrito
export const getCart = async () => {
  return fetchWrapper(`${baseUrl}/api/cart`, { method: 'GET' });
};

// POST: añadir producto al carrito
export const addToCart = async (productId, quantity = 1) => {
  return fetchWrapper(`${baseUrl}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
};

// DELETE: eliminar producto del carrito
export const deleteCartItem = async (itemId) => {
  return fetchWrapper(`${baseUrl}/api/cart/${itemId}`, {
    method: 'DELETE',
  });
};

// PUT: actualizar cantidad de producto
export const updateCartItem = async (itemId, quantity) => {
  return fetchWrapper(`${baseUrl}/api/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};
