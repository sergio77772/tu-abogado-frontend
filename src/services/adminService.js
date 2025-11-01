import api from '../utils/api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin.php', {
      params: { action: 'stats' },
    });
    return response.data;
  },

  getUsers: async (page = 1, limit = 10, rol = null) => {
    const params = { action: 'users', page, limit };
    if (rol) params.rol = rol;
    const response = await api.get('/api/admin.php', { params });
    return response.data;
  },

  getAbogados: async () => {
    const response = await api.get('/api/admin.php', {
      params: { action: 'abogados' },
    });
    return response.data;
  },

  getCompras: async (page = 1, limit = 10, estado = null) => {
    const params = { action: 'compras', page, limit };
    if (estado) params.estado = estado;
    const response = await api.get('/api/admin.php', { params });
    return response.data;
  },
};
