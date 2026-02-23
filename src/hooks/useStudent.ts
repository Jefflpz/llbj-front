import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';

export interface StudentData {
  id?: number;
  name?: string;
  email: string;
  urlImage?: string;
  className?: string;
}

export function useStudent() {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      api.get('/students').then((res) => {
        const allStudents = res.data;

        const found = allStudents.find((s: StudentData) =>
          s.email.split('@')[0].includes(user.username.split('.')[1]),
        );

        if (found) {
          setStudent(found);
        }
        setLoading(false);
      });
    }
  }, [user]);

  return { student, loading };
}
