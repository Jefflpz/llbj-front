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

/**
 * Hook para obter os dados do professor atualmente logado.
 * Usa o username do contexto de auth para encontrar o professor correspondente.
 */
export function useTeacher() {
    const { user } = useAuth();

    const fetcher = useMemo(
        () => async (): Promise<TeacherProfile | null> => {
            if (!user || user.role !== 'TEACHER') return null;
            const all = await teacherService.findAll();
            // Encontra pelo username que corresponde à matrícula ou email
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
