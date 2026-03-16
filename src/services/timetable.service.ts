import type {
    SchoolClass,
    Subject,
    TimetableItem,
    TimetableSlot,
} from '../models/timetable.model';

import { api } from './api';

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
    { id: 1, class_id: 1, period: 'Manhã', day_of_week: 'Segunda', start_time: '07:00', end_time: '07:50', subject_id: 101, active: 1 },
    { id: 2, class_id: 1, period: 'Manhã', day_of_week: 'Segunda', start_time: '07:50', end_time: '08:40', subject_id: 101, active: 1 },
    { id: 3, class_id: 1, period: 'Manhã', day_of_week: 'Segunda', start_time: '09:00', end_time: '09:50', subject_id: 103, active: 1 },
    { id: 4, class_id: 1, period: 'Manhã', day_of_week: 'Segunda', start_time: '09:50', end_time: '10:40', subject_id: 103, active: 1 },
    { id: 5, class_id: 1, period: 'Manhã', day_of_week: 'Segunda', start_time: '10:40', end_time: '11:30', subject_id: 105, active: 1 },
    
    { id: 6, class_id: 1, period: 'Manhã', day_of_week: 'Terça', start_time: '07:00', end_time: '07:50', subject_id: 104, active: 1 },
    { id: 7, class_id: 1, period: 'Manhã', day_of_week: 'Terça', start_time: '07:50', end_time: '08:40', subject_id: 104, active: 1 },
    { id: 8, class_id: 1, period: 'Manhã', day_of_week: 'Terça', start_time: '09:00', end_time: '09:50', subject_id: 102, active: 1 },
    { id: 9, class_id: 1, period: 'Manhã', day_of_week: 'Terça', start_time: '09:50', end_time: '10:40', subject_id: 102, active: 1 },
    { id: 10, class_id: 1, period: 'Manhã', day_of_week: 'Terça', start_time: '10:40', end_time: '11:30', subject_id: 108, active: 1 },

    { id: 11, class_id: 1, period: 'Manhã', day_of_week: 'Quarta', start_time: '07:00', end_time: '07:50', subject_id: 109, active: 1 },
    { id: 12, class_id: 1, period: 'Manhã', day_of_week: 'Quarta', start_time: '07:50', end_time: '08:40', subject_id: 109, active: 1 },
    { id: 13, class_id: 1, period: 'Manhã', day_of_week: 'Quarta', start_time: '09:00', end_time: '09:50', subject_id: 101, active: 1 },
    { id: 14, class_id: 1, period: 'Manhã', day_of_week: 'Quarta', start_time: '09:50', end_time: '10:40', subject_id: 101, active: 1 },
    { id: 15, class_id: 1, period: 'Manhã', day_of_week: 'Quarta', start_time: '10:40', end_time: '11:30', subject_id: 106, active: 1 },

    { id: 16, class_id: 1, period: 'Manhã', day_of_week: 'Quinta', start_time: '07:00', end_time: '07:50', subject_id: 103, active: 1 },
    { id: 17, class_id: 1, period: 'Manhã', day_of_week: 'Quinta', start_time: '07:50', end_time: '08:40', subject_id: 103, active: 1 },
    { id: 18, class_id: 1, period: 'Manhã', day_of_week: 'Quinta', start_time: '09:00', end_time: '09:50', subject_id: 107, active: 1 },
    { id: 19, class_id: 1, period: 'Manhã', day_of_week: 'Quinta', start_time: '09:50', end_time: '10:40', subject_id: 107, active: 1 },
    { id: 20, class_id: 1, period: 'Manhã', day_of_week: 'Quinta', start_time: '10:40', end_time: '11:30', subject_id: 108, active: 1 },

    { id: 21, class_id: 1, period: 'Manhã', day_of_week: 'Sexta', start_time: '07:00', end_time: '07:50', subject_id: 105, active: 1 },
    { id: 22, class_id: 1, period: 'Manhã', day_of_week: 'Sexta', start_time: '07:50', end_time: '08:40', subject_id: 109, active: 1 },
    { id: 23, class_id: 1, period: 'Manhã', day_of_week: 'Sexta', start_time: '09:00', end_time: '09:50', subject_id: 102, active: 1 },
    { id: 24, class_id: 1, period: 'Manhã', day_of_week: 'Sexta', start_time: '09:50', end_time: '10:40', subject_id: 104, active: 1 },
    { id: 25, class_id: 1, period: 'Manhã', day_of_week: 'Sexta', start_time: '10:40', end_time: '11:30', subject_id: 106, active: 1 },
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
        return [];
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
        MOCK_TIMETABLE = MOCK_TIMETABLE.filter(
            (t) => !(t.class_id === classId && t.period === period),
        );
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
