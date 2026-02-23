import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export interface AdminProfile {
    name: string;
    role: string;
    urlImage: string;
}

export function useAdmin() {
    const { user } = useAuth();
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            // Atualmente podemos simular os dados do admin logado a partir do objeto user ou endpoint
            setAdmin({
                name: user.username,
                role: 'Administrator',
                urlImage: `https://ui-avatars.com/api/?name=${user.username || 'Admin'}&background=random`
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [user]);

    return { admin, loading };
}
