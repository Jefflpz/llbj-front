import { api } from './api';

export const observationService = {
  findByStudentId: (id: string) => api.get(`/observations/student/${id}`),
  findAll: () => api.get('/observations'),
};
