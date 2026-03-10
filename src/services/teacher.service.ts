import { api } from './api';

export interface Teacher {
  registration: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  urlImage: string | null;
}

export interface TeacherRequest {
  registration: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  urlImage?: string | null;
  accountId: number;
}

export const teacherService = {
  findAll: (): Promise<Teacher[]> =>
    api.get<Teacher[]>('/teachers').then((r) => r.data),

  findByRegistration: (registration: string): Promise<Teacher> =>
    api.get<Teacher>(`/teachers/${registration}`).then((r) => r.data),

  create: (dto: TeacherRequest): Promise<Teacher> =>
    api.post<Teacher>('/teachers', dto).then((r) => r.data),

  update: (registration: string, dto: TeacherRequest): Promise<Teacher> =>
    api.put<Teacher>(`/teachers/${registration}`, dto).then((r) => r.data),

  delete: (registration: string): Promise<void> =>
    api.delete(`/teachers/${registration}`).then(() => undefined),
};
