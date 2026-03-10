import { api } from './api';

export interface Grade {
    id: number;
    studentId: string;
    subjectId: number;
    subjectName: string;
    n1: number | null;
    n2: number | null;
    n3: number | null;
    average: number | null;
}

export interface GradeRequest {
    studentId: string;
    subjectId: number;
    n1?: number | null;
    n2?: number | null;
    n3?: number | null;
}

export const gradesService = {
    findBySubject: (subjectId: number): Promise<Grade[]> =>
        api.get<Grade[]>(`/grades?subjectId=${subjectId}`).then((r) => r.data),

    findById: (studentId: string, subjectId: number): Promise<Grade> =>
        api.get<Grade>(`/grades/${studentId}/${subjectId}`).then((r) => r.data),

    /** Cria/salva múltiplas notas em lote (POST /grades aceita array) */
    save: (data: GradeRequest[]): Promise<Grade[]> =>
        api.post<Grade[]>('/grades', data).then((r) => r.data),

    update: (studentId: string, subjectId: number, dto: GradeRequest): Promise<Grade> =>
        api.put<Grade>(`/grades/${studentId}/${subjectId}`, dto).then((r) => r.data),

    delete: (studentId: string, subjectId: number): Promise<void> =>
        api.delete(`/grades/${studentId}/${subjectId}`).then(() => undefined),
};
