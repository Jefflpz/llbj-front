import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { agendaService } from '../services/agenda.service';
import type { Agenda, Material } from '../services/agenda.service';

export type { Agenda, Material };

export interface AgendaWithMaterials {
    agendas: Agenda[];
    materials: Material[];
}

/**
 * Hook para buscar as agendas semanais e todos os materiais de uma disciplina.
 * @param subjectId - ID da disciplina.
 */
export function useAgenda(subjectId: number) {
    const fetcher = useMemo(
        () => async (): Promise<AgendaWithMaterials> => {
            const [agendas, materials] = await Promise.all([
                agendaService.findAgendas(subjectId),
                agendaService.findMaterialsBySubject(subjectId),
            ]);
            return { agendas, materials };
        },
        [subjectId]
    );

    return useQuery<AgendaWithMaterials>(fetcher, [subjectId]);
}
