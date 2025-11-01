import api from '../utils/api';

export const planesService = {
  getPlanes: async (page = 1, limit = 10) => {
    const response = await api.get('/api/planes.php', {
      params: { page, limit },
    });
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get('/api/planes.php', {
      params: { id },
    });
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/api/planes.php', planData);
    return response.data;
  },
};
