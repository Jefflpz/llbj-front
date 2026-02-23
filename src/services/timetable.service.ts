import type {
    SchoolClass,
    Subject,
    TimetableItem,
    TimetableSlot,
} from '../models/timetable.model';

/**
 * Mock data para suportar o desenvolvimento isolado da tela.
 */
const MOCK_CLASSES: SchoolClass[] = [
    { id: 1, name: '9º Ano A - Ensino Fundamental' },
    { id: 2, name: '1º Ano B - Ensino Médio' },
];

const MOCK_SUBJECTS: Subject[] = [
    {
        id: 101,
        name: 'Matemática',
        class_id: 1,
        teacher_registration: 'T01',
        teacher: { registration: 'T01', name: 'Prof. Silva' },
        weeklyTargetHours: 6,
        category: 'CIÊNCIAS EXATAS',
        topic: 'Equações',
    },
    {
        id: 102,
        name: 'Física',
        class_id: 1,
        teacher_registration: 'T02',
        teacher: { registration: 'T02', name: 'Prof. Roberto' },
        weeklyTargetHours: 4,
        category: 'CIÊNCIAS EXATAS',
    },
    {
        id: 108,
        name: 'Química',
        class_id: 1,
        teacher_registration: 'T08',
        teacher: { registration: 'T08', name: 'Prof. Ronaldo' },
        weeklyTargetHours: 4,
        category: 'CIÊNCIAS EXATAS',
    },
    {
        id: 103,
        name: 'Português',
        class_id: 1,
        teacher_registration: 'T03',
        teacher: { registration: 'T03', name: 'Prof. Ana' },
        weeklyTargetHours: 6,
        category: 'HUMANAS',
        topic: 'Redação',
    },
    {
        id: 104,
        name: 'História',
        class_id: 1,
        teacher_registration: 'T04',
        teacher: { registration: 'T04', name: 'Prof. Carlos' },
        weeklyTargetHours: 4,
        category: 'HUMANAS',
    },
    {
        id: 105,
        name: 'Geografia',
        class_id: 1,
        teacher_registration: 'T05',
        teacher: { registration: 'T05', name: 'Prof. Julia' },
        weeklyTargetHours: 4,
        category: 'HUMANAS',
    },
    {
        id: 109,
        name: 'Biologia',
        class_id: 1,
        teacher_registration: 'T09',
        teacher: { registration: 'T09', name: 'Prof. Carla' },
        weeklyTargetHours: 4,
        category: 'NATUREZA',
    },
    {
        id: 106,
        name: 'Artes',
        class_id: 1,
        teacher_registration: 'T06',
        teacher: { registration: 'T06', name: 'Prof. Marcos' },
        weeklyTargetHours: 2,
        category: 'ARTES & ESPORTES',
    },
    {
        id: 107,
        name: 'Ed. Física',
        class_id: 1,
        teacher_registration: 'T07',
        teacher: { registration: 'T07', name: 'Prof. Paulo' },
        weeklyTargetHours: 3,
        category: 'ARTES & ESPORTES',
    }
];

const MOCK_SLOTS_MANHA: TimetableSlot[] = [];
const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const times = [
    { start: '07:00', end: '07:50', isBreak: false },
    { start: '07:50', end: '08:40', isBreak: false },
    { start: '08:40', end: '09:00', isBreak: true },
    { start: '09:00', end: '09:50', isBreak: false },
    { start: '09:50', end: '10:40', isBreak: false },
    { start: '10:40', end: '11:30', isBreak: false },
];

days.forEach((day) => {
    times.forEach((t) => {
        MOCK_SLOTS_MANHA.push({
            slot_key: `${day}-${t.start}`,
            day_of_week: day,
            start_time: t.start,
            end_time: t.end,
            is_break: t.isBreak,
        });
    });
});

let MOCK_TIMETABLE: TimetableItem[] = [
    {
        id: 1,
        class_id: 1,
        period: 'Manhã',
        day_of_week: 'Segunda',
        start_time: '07:00',
        end_time: '07:50',
        subject_id: 101, // Matemática
        active: 1,
    },
    {
        id: 2,
        class_id: 1,
        period: 'Manhã',
        day_of_week: 'Segunda',
        start_time: '07:50',
        end_time: '08:40',
        subject_id: 102, // Física
        active: 1,
    },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const timetableService = {
    async getClasses(): Promise<SchoolClass[]> {
        await delay(300);
        return MOCK_CLASSES;
    },

    async getSubjectsByClass(classId: number): Promise<Subject[]> {
        await delay(300);
        return MOCK_SUBJECTS.filter((s) => s.class_id === classId);
    },

    async getSlots(period: string): Promise<TimetableSlot[]> {
        await delay(300);
        if (period === 'Manhã') return MOCK_SLOTS_MANHA;
        return []; // Para simplificar, só implementamos Manhã no mock
    },

    async getTimetable(classId: number, period: string): Promise<TimetableItem[]> {
        await delay(300);
        return MOCK_TIMETABLE.filter(
            (t) => t.class_id === classId && t.period === period,
        );
    },

    async saveTimetable(
        classId: number,
        period: string,
        items: TimetableItem[],
    ): Promise<void> {
        await delay(500);
        // Remove os antigas
        MOCK_TIMETABLE = MOCK_TIMETABLE.filter(
            (t) => !(t.class_id === classId && t.period === period),
        );
        // Salva as novas
        items.forEach((item, index) => {
            MOCK_TIMETABLE.push({ ...item, id: Date.now() + index });
        });
        console.log('Grade salva com sucesso!', MOCK_TIMETABLE);
    },

    async clearTimetable(classId: number, period: string): Promise<void> {
        await delay(300);
        MOCK_TIMETABLE = MOCK_TIMETABLE.filter(
            (t) => !(t.class_id === classId && t.period === period),
        );
    },

    async exportPdf(classId: number, period: string): Promise<void> {
        await delay(800);
        alert(`Exportando PDF da turma ${classId} - Período: ${period}`);
    },
};
