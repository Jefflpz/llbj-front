export interface WeeklyAgenda {
    id: number;
    weekName: string; // e.g., "Semana 1 - Biologia"
    startDate: string; // ISO String
    endDate: string; // ISO String
    subjectId: number; // Links to a Turma/Subject
}

export interface ClassMaterial {
    id: number;
    weekId: number; // Links to a WeeklyAgenda
    title: string;
    url: string;
    type: 'PDF' | 'VIDEO' | 'LINK';
}

export const weeklyAgendasData: WeeklyAgenda[] = [
    {
        id: 1,
        weekName: "Semana 1 - Introdução às Células",
        startDate: "2023-10-01T00:00:00Z",
        endDate: "2023-10-07T23:59:59Z",
        subjectId: 1
    },
    {
        id: 2,
        weekName: "Semana 2 - Mitose e Meiose",
        startDate: "2023-10-08T00:00:00Z",
        endDate: "2023-10-14T23:59:59Z",
        subjectId: 1
    },
    {
        id: 3,
        weekName: "Semana 1 - Cinemática",
        startDate: "2023-10-01T00:00:00Z",
        endDate: "2023-10-07T23:59:59Z",
        subjectId: 2
    }
];

export const classMaterialsData: ClassMaterial[] = [
    {
        id: 1,
        weekId: 1,
        title: "Apostila de Biologia Celular",
        url: "#",
        type: 'PDF'
    },
    {
        id: 2,
        weekId: 1,
        title: "Videoaula: O que é uma Célula?",
        url: "#",
        type: 'VIDEO'
    },
    {
        id: 3,
        weekId: 2,
        title: "Resumo Mitose (PDF)",
        url: "#",
        type: 'PDF'
    },
    {
        id: 4,
        weekId: 3,
        title: "Exercícios de Fixação - Cinemática",
        url: "#",
        type: 'PDF'
    }
];
