// services/auth.js
import api from './api';

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null);
};