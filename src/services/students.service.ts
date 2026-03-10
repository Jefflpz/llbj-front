import { api } from './api';

export interface Student {
    id: string;
    name: string;
    email: string;
    registration: string;
    status: string;
    classId: number;
    className: string;
    urlImage: string | null;
}

export interface StudentRequest {
    id: string;
    name: string;
    email: string;
    registration: string;
    classId: number;
    urlImage?: string | null;
    userId: number;
}

export const studentsService = {
    findAll: (): Promise<Student[]> =>
        api.get<Student[]>('/students').then((r) => r.data),

    findByClass: (classId: number): Promise<Student[]> =>
        api.get<Student[]>(`/students?classId=${classId}`).then((r) => r.data),

    findById: (id: string): Promise<Student> =>
        api.get<Student>(`/students/${id}`).then((r) => r.data),

    create: (dto: StudentRequest): Promise<Student> =>
        api.post<Student>('/students', dto).then((r) => r.data),

    update: (id: string, dto: StudentRequest): Promise<Student> =>
        api.put<Student>(`/students/${id}`, dto).then((r) => r.data),

    delete: (id: string): Promise<void> =>
        api.delete(`/students/${id}`).then(() => undefined),
};
