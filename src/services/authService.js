import api from '../utils/api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth.php?action=register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth.php?action=login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
