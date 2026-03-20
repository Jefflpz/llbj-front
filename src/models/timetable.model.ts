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
    topic?: string;
}

export interface TimetableSlot {
    slot_key: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_break?: boolean;
}

export interface TimetableItem {
    id?: number;
    class_id: number;
    period: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    subject_id: number;
    active: boolean | number;
}
