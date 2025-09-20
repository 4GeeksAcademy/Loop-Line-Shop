import { createContext, useState, useEffect } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  deleteCartItem,
  updateCartItem,
} from '../services/api/cart';

export const CartContext = createContext({
  cart: { items: [] },
  fetchCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error('❌ Error al cargar el carrito:', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await apiAddToCart(productId, quantity);
      await fetchCart(); // refresca carrito
    } catch (err) {
      console.error('❌ Error al añadir al carrito:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      await fetchCart();
    } catch (err) {
      console.error('❌ Error al eliminar del carrito:', err);
    }
  };

  const clearCart = async () => {
    try {
      // puedes crear un endpoint /cart/clear o iterar items
      for (const item of cart.items) {
        await deleteCartItem(item.id);
      }
      setCart({ items: [] });
    } catch (err) {
      console.error('❌ Error al vaciar el carrito:', err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error('❌ Error al actualizar cantidad:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
