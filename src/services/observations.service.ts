import { api } from './api';

export type ObservationType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface Observation {
  id: number;
  classId: number;
  className: string;
  studentIds: string[];
  teacherRegistration: string;
  teacherName: string;
  message: string;
  type: ObservationType;
  createdAt: string;
}

export interface ObservationRequest {
  classId: number;
  studentIds: string[];
  teacherRegistration: string;
  message: string;
  type: ObservationType;
}

export const observationService = {
  findAll: (): Promise<Observation[]> =>
    api.get<Observation[]>('/observations').then((r) => r.data),

  findById: (id: number): Promise<Observation> =>
    api.get<Observation>(`/observations/${id}`).then((r) => r.data),

  findByStudentId: (studentId: string): Promise<Observation[]> =>
    api.get<Observation[]>(`/observations/student/${studentId}`).then((r) => r.data),

  create: (dto: ObservationRequest): Promise<Observation> =>
    api.post<Observation>('/observations', dto).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/observations/${id}`).then(() => undefined),
};
