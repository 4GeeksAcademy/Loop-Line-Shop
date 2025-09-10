import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const checkoutOrder = async (userId) => {
  const { data } = await axios.post(`${API_URL}/checkout`, { user_id: userId });
  return data;
};
