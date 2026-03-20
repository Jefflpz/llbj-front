import type {
    SchoolClass,
    Subject,
    TimetableItem,
    TimetableSlot,
} from '../models/timetable.model';

/**
 * Mock data para suportar o desenvolvimento isolado da tela.
 */
import { api } from './api';

// Mock constants removed

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
        const { data } = await api.get<SchoolClass[]>('/classes');
        return data;
    },

    async getSubjectsByClass(classId: number): Promise<Subject[]> {
        const { data } = await api.get(`/subjects?classId=${classId}`);
        return data.map((s: any) => ({
            id: s.id,
            name: s.name,
            class_id: s.classId || classId,
            teacher_registration: s.teacherRegistration || '',
            teacher: { registration: s.teacherRegistration || '', name: s.teacherName || '' }
        }));
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
