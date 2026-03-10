import { api } from './api';

export interface SchoolClass {
    id: number;
    name: string;
}

export interface SchoolClassRequest {
    name: string;
}

export const classesService = {
    findAll: (): Promise<SchoolClass[]> =>
        api.get<SchoolClass[]>('/classes').then((r) => r.data),

    findById: (id: number): Promise<SchoolClass> =>
        api.get<SchoolClass>(`/classes/${id}`).then((r) => r.data),

    create: (dto: SchoolClassRequest): Promise<SchoolClass> =>
        api.post<SchoolClass>('/classes', dto).then((r) => r.data),

    update: (id: number, dto: SchoolClassRequest): Promise<SchoolClass> =>
        api.put<SchoolClass>(`/classes/${id}`, dto).then((r) => r.data),

    delete: (id: number): Promise<void> =>
        api.delete(`/classes/${id}`).then(() => undefined),
};
