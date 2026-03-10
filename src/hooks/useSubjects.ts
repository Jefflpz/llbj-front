import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { subjectsService } from '../services/subjects.service';
import type { Subject } from '../services/subjects.service';

export type { Subject };

/**
 * Hook para listar disciplinas.
 * @param classId - Se fornecido, filtra pelo ID da turma.
 * @param teacherRegistration - Se fornecido, filtra pela matrícula do professor.
 */
export function useSubjects(classId?: number, teacherRegistration?: string) {
    const fetcher = useMemo(
        () => {
            if (teacherRegistration) {
                return () => subjectsService.findByTeacher(teacherRegistration);
            }
            if (classId !== undefined) {
                return () => subjectsService.findByClass(classId);
            }
            return () => subjectsService.findAll();
        },
        [classId, teacherRegistration]
    );

    return useQuery<Subject[]>(fetcher, [classId, teacherRegistration]);
}
