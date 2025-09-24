import { createContext, useState, useEffect, useContext } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  deleteCartItem,
  updateCartItem,
} from '../services/api/cart';
import { UserContext } from './User';

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
  const { user } = useContext(UserContext);

  const fetchCart = async () => {
    if (!user?.id) return;
    try {
      const data = await getCart(user.id);
      setCart(data);
    } catch (err) {
      console.error('❌ Error al cargar el carrito:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await apiAddToCart(productId, quantity);
      await fetchCart();
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
      for (const item of cart.items) {
        await deleteCartItem(item.id);
      }
      setCart({ items: [] });
    } catch (err) {
      console.error('❌ Error al vaciar el carrito:', err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
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
