export interface QuizOption {
    id: string; // UUID to manage dynamically
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id: string; // UUID
    title: string;
    options: QuizOption[];
}

export interface Quiz {
    id: string; // UUID
    title: string;
    description: string;
    score: number;
    releaseDate: string | null;
    deadline: string | null;

    // Associations
    subjectId: number | null; // Turma / Subject ID
    weekId: number | null; // Weekly Agenda ID
    materialId: number | null; // Class Material ID

    questions: QuizQuestion[];

    createdAt: string;
}

// Emulate a DB table
export let quizzesData: Quiz[] = [
    {
        id: 'quiz-1',
        title: 'Quiz de Fixação: Células',
        description: 'Teste seus conhecimentos sobre o conteúdo da Semana 1.',
        score: 10,
        releaseDate: '2023-10-05T08:00',
        deadline: '2023-10-10T23:59',
        subjectId: 1,
        weekId: 1,
        materialId: 1,
        createdAt: new Date().toISOString(),
        questions: [
            {
                id: 'q1',
                title: 'Qual das organelas abaixo é responsável pela respiração celular?',
                options: [
                    { id: 'opt1', text: 'Ribossomo', isCorrect: false },
                    { id: 'opt2', text: 'Mitocôndria', isCorrect: true },
                    { id: 'opt3', text: 'Complexo de Golgi', isCorrect: false },
                    { id: 'opt4', text: 'Lisossomo', isCorrect: false },
                ]
            }
        ]
    }
];

// Transaction Methods to simulate Database Actions
export const addQuiz = (newQuiz: Quiz) => {
    quizzesData = [newQuiz, ...quizzesData];
};

export const updateQuiz = (updatedQuiz: Quiz) => {
    quizzesData = quizzesData.map(q => q.id === updatedQuiz.id ? updatedQuiz : q);
};

export const deleteQuiz = (quizId: string) => {
    quizzesData = quizzesData.filter(q => q.id !== quizId);
};
