import { utils } from '../lib/client';

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

export const saveAuthData = (response: utils.iUserLoginResponse) => {
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getUser = (): utils.iUser | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};
