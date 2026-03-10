import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { gradesService } from '../services/grades.service';
import type { Grade } from '../services/grades.service';

export type { Grade };

/**
 * Hook para gerenciar notas de uma disciplina.
 * @param subjectId - ID da disciplina.
 */
export function useGrades(subjectId: number) {
    const fetcher = useMemo(
        () => () => gradesService.findBySubject(subjectId),
        [subjectId]
    );

    const query = useQuery<Grade[]>(fetcher, [subjectId]);

    const save = async (data: Grade[]) => {
        await gradesService.save(data);
        query.refetch();
    };

    return { ...query, save };
}
