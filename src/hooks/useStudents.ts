import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { studentsService } from '../services/students.service';
import type { Student } from '../services/students.service';

export type { Student };

/**
 * Hook para listar alunos.
 * @param classId - Se fornecido, filtra pelo ID da turma.
 */
export function useStudents(classId?: number) {
    const fetcher = useMemo(
        () =>
            classId !== undefined
                ? () => studentsService.findByClass(classId)
                : () => studentsService.findAll(),
        [classId]
    );

    return useQuery<Student[]>(fetcher, [classId]);
}
