import { api } from './api';

export const teacherService = {
  findAll: () => api.get('/teachers'),

  findByRegistration: (registration: string) =>
    api.get(`/teachers/${registration}`),
};
