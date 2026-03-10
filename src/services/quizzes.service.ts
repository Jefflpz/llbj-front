import { api } from './api';

export interface QuizOption {
    text: string;
    correct: boolean;
}

export interface QuizQuestion {
    text: string;
    options: QuizOption[];
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    score: number;
    releaseDate: string;
    deadline: string;
    subjectId: number;
    weekId: number | null;
    materialId: number | null;
    createdAt: string;
    questions: QuizQuestion[];
}

export interface QuizRequest {
    title: string;
    description?: string;
    score: number;
    releaseDate: string;
    deadline: string;
    subjectId: number;
    weekId?: number | null;
    materialId?: number | null;
    questions: QuizQuestion[];
}

export const quizzesService = {
    findAll: (): Promise<Quiz[]> =>
        api.get<Quiz[]>('/quizzes').then((r) => r.data),

    findBySubject: (subjectId: number): Promise<Quiz[]> =>
        api.get<Quiz[]>(`/quizzes?subjectId=${subjectId}`).then((r) => r.data),

    findById: (id: string): Promise<Quiz> =>
        api.get<Quiz>(`/quizzes/${id}`).then((r) => r.data),

    create: (dto: QuizRequest): Promise<Quiz> =>
        api.post<Quiz>('/quizzes', dto).then((r) => r.data),

    update: (id: string, dto: QuizRequest): Promise<Quiz> =>
        api.put<Quiz>(`/quizzes/${id}`, dto).then((r) => r.data),

    delete: (id: string): Promise<void> =>
        api.delete(`/quizzes/${id}`).then(() => undefined),
};
