import { api } from './api';

export interface Subject {
    id: number;
    name: string;
    classId: number;
    className: string;
    teacherRegistration: string;
    teacherName: string;
}

export interface SubjectRequest {
    name: string;
    classId: number;
    teacherRegistration: string;
}

export const subjectsService = {
    findAll: (): Promise<Subject[]> =>
        api.get<Subject[]>('/subjects').then((r) => r.data),

    findByClass: (classId: number): Promise<Subject[]> =>
        api.get<Subject[]>(`/subjects?classId=${classId}`).then((r) => r.data),

    findByTeacher: (teacherRegistration: string): Promise<Subject[]> =>
        api.get<Subject[]>(`/subjects?teacherRegistration=${teacherRegistration}`).then((r) => r.data),

    findById: (id: number): Promise<Subject> =>
        api.get<Subject>(`/subjects/${id}`).then((r) => r.data),

    create: (dto: SubjectRequest): Promise<Subject> =>
        api.post<Subject>('/subjects', dto).then((r) => r.data),

    update: (id: number, dto: SubjectRequest): Promise<Subject> =>
        api.put<Subject>(`/subjects/${id}`, dto).then((r) => r.data),

    delete: (id: number): Promise<void> =>
        api.delete(`/subjects/${id}`).then(() => undefined),
};
