import { api } from './api';

export interface Material {
  id: number;
  weekId: number;
  title: string;
  url: string;
  type: 'PDF' | 'VIDEO' | 'LINK';
}

export interface MaterialRequest {
  title: string;
  url: string;
  type: 'PDF' | 'VIDEO' | 'LINK';
  weekId: number;
}

export const materialsService = {
  findAll: (weekId?: number, subjectId?: number): Promise<Material[]> => {
    let url = '/materials';
    const params = new URLSearchParams();
    if (weekId) params.append('weekId', weekId.toString());
    if (subjectId) params.append('subjectId', subjectId.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return api.get<Material[]>(url).then((r) => r.data);
  },

  delete: (id: number): Promise<void> =>
    api.delete(`/materials/${id}`).then(() => undefined),
};
