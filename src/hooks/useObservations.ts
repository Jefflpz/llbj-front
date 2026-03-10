import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { observationService, type Observation, type ObservationRequest } from '../services/observations.service';

const fetchObservations = (classId: number): Promise<Observation[]> =>
    observationService.findAll().then((obs) =>
        obs
            .filter((o) => o.classId === classId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );

export function useObservations(classId: number) {
    const fetcher = useMemo(() => () => fetchObservations(classId), [classId]);
    const query = useQuery<Observation[]>(fetcher, [classId]);

    const addObservation = async (
        teacherRegistration: string,
        message: string,
        type: ObservationRequest['type'],
        studentIds: string[]
    ) => {
        await observationService.create({
            classId,
            teacherRegistration,
            message,
            type,
            studentIds,
        });
        query.refetch();
    };

    return { ...query, addObservation };
}

export type { Observation };
