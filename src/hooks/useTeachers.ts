import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { teacherService } from '../services/teacher.service';
import type { Teacher } from '../services/teacher.service';

export type { Teacher };

/**
 * Hook para listar todos os professores (usado no painel admin).
 */
export function useTeachers() {
    const fetcher = useMemo(() => () => teacherService.findAll(), []);
    return useQuery<Teacher[]>(fetcher);
}
