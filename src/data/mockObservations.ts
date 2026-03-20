export interface Observation {
    id: number;
    class_id: number;
    teacher_registration: string;
    message: string;
    type: '1' | '2' | '3';
    created_at: string;
}

export interface ObservationStudent {
    observation_id: number;
    student_id: string;
}

export let observationsData: Observation[] = [
    {
        id: 1,
        class_id: 1,
        teacher_registration: 'PROF-001',
        message: 'Atraso reincidente após o intervalo.',
        type: '3',
        created_at: '2026-02-28T14:30:00Z',
    },
    {
        id: 2,
        class_id: 1,
        teacher_registration: 'PROF-001',
        message: 'Ótimo desempenho no projeto bimestral.',
        type: '2',
        created_at: '2026-02-25T10:15:00Z',
    }
];

export let observationStudentData: ObservationStudent[] = [
    { observation_id: 1, student_id: '1' },
    { observation_id: 1, student_id: '2' },
    { observation_id: 2, student_id: '1' },
];

export const addObservationTransaction = (
    class_id: number,
    teacher_registration: string,
    message: string,
    type: '1' | '2' | '3',
    student_ids: string[]
) => {
    const newObs: Observation = {
        id: Date.now(),
        class_id,
        teacher_registration,
        message,
        type,
        created_at: new Date().toISOString()
    };

    observationsData = [newObs, ...observationsData];

    const newLinks: ObservationStudent[] = student_ids.map(s_id => ({
        observation_id: newObs.id,
        student_id: s_id
    }));

    observationStudentData = [...newLinks, ...observationStudentData];

    return newObs;
};
