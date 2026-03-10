import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { quizzesService } from '../services/quizzes.service';
import type { Quiz, QuizRequest } from '../services/quizzes.service';

export type { Quiz, QuizRequest };

/**
 * Hook para listar e gerenciar quizzes de uma disciplina.
 * @param subjectId - ID da disciplina para filtrar.
 */
export function useQuizzes(subjectId: number) {
    const fetcher = useMemo(
        () => () => quizzesService.findBySubject(subjectId),
        [subjectId]
    );

    const query = useQuery<Quiz[]>(fetcher, [subjectId]);

    const create = async (dto: QuizRequest) => {
        await quizzesService.create(dto);
        query.refetch();
    };

    const update = async (id: string, dto: QuizRequest) => {
        await quizzesService.update(id, dto);
        query.refetch();
    };

    const remove = async (quizId: string) => {
        await quizzesService.delete(quizId);
        query.refetch();
    };

    return { ...query, create, update, remove };
}
