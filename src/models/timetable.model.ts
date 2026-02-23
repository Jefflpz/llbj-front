export interface SchoolClass {
    id: number;
    name: string;
}

export interface Teacher {
    registration: string;
    name: string;
    url_image?: string;
}

export interface Subject {
    id: number;
    name: string;
    class_id: number;
    teacher_registration: string;
    teacher?: Teacher;
    weeklyTargetHours?: number;
    category?: string;
}

export interface TimetableSlot {
    slot_key: string; // Ex: Segunda-07:00
    day_of_week: string; // Ex: Segunda
    start_time: string; // Ex: 07:00
    end_time: string; // Ex: 07:50
    is_break?: boolean;
}

export interface TimetableItem {
    id?: number;
    class_id: number;
    period: string; // Ex: Manhã
    day_of_week: string;
    start_time: string;
    end_time: string;
    subject_id: number;
    active: boolean | number;
}
