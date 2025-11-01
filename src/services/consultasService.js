import api from '../utils/api';

export const consultasService = {
  getConsultas: async (id = null, action = null) => {
    const params = {};
    if (id) params.id = id;
    if (action) params.action = action;
    const response = await api.get('/api/consultas.php', { params });
    return response.data;
  },

  createConsulta: async (consultaData) => {
    const response = await api.post('/api/consultas.php', consultaData);
    return response.data;
  },

  updateConsulta: async (id, updateData) => {
    const response = await api.put('/api/consultas.php', updateData, {
      params: { id },
    });
    return response.data;
  },
};
