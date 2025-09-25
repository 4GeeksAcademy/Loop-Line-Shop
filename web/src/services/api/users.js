import { baseUrl, fetchWrapper } from './config';

const usersEndpoint = `${baseUrl}favourites`;

export const getCurrentUser = async () => {
  return await fetchWrapper(`${baseUrl}/me`, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const getUserFavourites = async () => {
  return await fetchWrapper(usersEndpoint, {
    credentials: 'include',
  }).then((data) => {
    return data;
  });
};

export const postUserFavourite = async (externalId, name, type) => {
  return await fetchWrapper(usersEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      external_id: externalId,
      name: name,
      type: type,
    }),
  }).then((data) => {
    return data;
  });
};

export const deleteUserFavourite = async (favouriteId) => {
  return await fetchWrapper(usersEndpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: favouriteId,
    }),
  }).then((data) => {
    return data;
  });
};
