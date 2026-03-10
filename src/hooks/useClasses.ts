import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { classesService } from '../services/classes.service';
import type { SchoolClass } from '../services/classes.service';

export type { SchoolClass };

/**
 * Hook para listar todas as turmas.
 */
export function useClasses() {
    const fetcher = useMemo(() => () => classesService.findAll(), []);
    return useQuery<SchoolClass[]>(fetcher);
}
