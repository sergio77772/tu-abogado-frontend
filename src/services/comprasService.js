import api from '../utils/api';

export const comprasService = {
  getCompras: async (id = null) => {
    const params = id ? { id } : {};
    const response = await api.get('/api/compras.php', { params });
    return response.data;
  },

  createCompra: async (compraData) => {
    const response = await api.post('/api/compras.php', compraData);
    return response.data;
  },
};
