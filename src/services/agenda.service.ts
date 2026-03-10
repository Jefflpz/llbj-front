import { api } from './api';

export interface Agenda {
    id: number;
    weekName: string;
    startDate: string;
    endDate: string;
    subjectId: number;
}

export interface AgendaRequest {
    weekName: string;
    startDate: string;
    endDate: string;
    subjectId: number;
}

export interface Material {
    id: number;
    weekId: number;
    title: string;
    url: string;
    type: 'PDF' | 'VIDEO' | 'LINK' | string;
}

export interface MaterialRequest {
    weekId: number;
    title: string;
    url: string;
    type: string;
}

export const agendaService = {
    findAgendas: (subjectId: number): Promise<Agenda[]> =>
        api.get<Agenda[]>(`/agendas?subjectId=${subjectId}`).then((r) => r.data),

    findAgendaById: (id: number): Promise<Agenda> =>
        api.get<Agenda>(`/agendas/${id}`).then((r) => r.data),

    createAgenda: (dto: AgendaRequest): Promise<Agenda> =>
        api.post<Agenda>('/agendas', dto).then((r) => r.data),

    updateAgenda: (id: number, dto: AgendaRequest): Promise<Agenda> =>
        api.put<Agenda>(`/agendas/${id}`, dto).then((r) => r.data),

    deleteAgenda: (id: number): Promise<void> =>
        api.delete(`/agendas/${id}`).then(() => undefined),

    findMaterials: (weekId: number): Promise<Material[]> =>
        api.get<Material[]>(`/materials?weekId=${weekId}`).then((r) => r.data),

    findMaterialsBySubject: (subjectId: number): Promise<Material[]> =>
        api.get<Material[]>(`/materials?subjectId=${subjectId}`).then((r) => r.data),

    createMaterial: (dto: MaterialRequest): Promise<Material> =>
        api.post<Material>('/materials', dto).then((r) => r.data),

    updateMaterial: (id: number, dto: MaterialRequest): Promise<Material> =>
        api.put<Material>(`/materials/${id}`, dto).then((r) => r.data),

    deleteMaterial: (id: number): Promise<void> =>
        api.delete(`/materials/${id}`).then(() => undefined),
};
