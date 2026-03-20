import { useMemo } from 'react';
import { useQuery } from './useQuery';
import { useAuth } from '../auth/AuthContext';
import { teacherService } from '../services/teacher.service';

export interface TeacherProfile {
    registration: string;
    name: string;
    email: string;
    subject: string;
    urlImage: string;
    status: 'Ativo' | 'Inativo';
}

export function useTeacher() {
    const { user } = useAuth();

    const fetcher = useMemo(
        () => async (): Promise<TeacherProfile | null> => {
            if (!user || user.role !== 'TEACHER') return null;
            const all = await teacherService.findAll();
            const found = all.find(
                (t) =>
                    t.registration.toLowerCase() === user.username.toLowerCase() ||
                    t.email.split('@')[0].toLowerCase() === user.username.toLowerCase()
            );
            return (found as TeacherProfile) ?? null;
        },
        [user]
    );

    return useQuery<TeacherProfile | null>(fetcher, [user?.username]);
}
