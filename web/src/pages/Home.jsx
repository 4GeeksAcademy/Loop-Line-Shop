import { getCurrentUser } from '../services/api/users';

export const Home = () => {
  getCurrentUser().then((data) => {
    console.log(data);
  });

  return <>Produtos</>;
};
