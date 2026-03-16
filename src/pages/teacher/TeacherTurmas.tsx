import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import './TeacherTurmas.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { subjectsService, type Subject } from '../../services/subjects.service';
import { classesService, type SchoolClass } from '../../services/classes.service';
import {
    Users,
    BookOpen,
    Inbox,
    Loader2,
} from 'lucide-react';

const today = new Date();

function formatDate(date: Date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

interface TurmaWithSubjects extends SchoolClass {
    subjects: Subject[];
}

export default function TeacherTurmas() {
    const dateLabel = formatDate(today);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [turmas, setTurmas] = useState<TurmaWithSubjects[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const registration = user?.registration;
        if (!registration) {
            setError('Perfil do professor não carregado. Faça login novamente.');
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                const subjects = await subjectsService.findByTeacher(registration);

                const uniqueClassIds = [...new Set(subjects.map((s) => s.classId))];

                const classDetails = await Promise.all(
                    uniqueClassIds.map((id) => classesService.findById(id))
                );

                const combined: TurmaWithSubjects[] = classDetails.map((cls) => ({
                    ...cls,
                    subjects: subjects.filter((s) => s.classId === cls.id),
                }));

                setTurmas(combined);
            } catch (err) {
                console.error('Erro ao carregar turmas:', err);
                setError('Não foi possível carregar as turmas. Verifique se o servidor está ativo.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.registration]);

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Minhas Turmas' },
                        ]} />
                        <h1><strong>Minhas Turmas</strong></h1>
                        <p>{dateLabel}</p>
                    </div>
                </header>

                <div className="turmas-container">
                    {loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#64748b' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                            <p>Carregando suas turmas...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && turmas.length === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#94a3b8' }}>
                            <Inbox size={48} />
                            <p>Nenhuma turma encontrada para o seu perfil.</p>
                            <p style={{ fontSize: '0.85rem' }}>Solicite ao administrador que vincule disciplinas ao seu cadastro.</p>
                        </div>
                    )}

                    {!loading && !error && turmas.length > 0 && (
                        <div className="turmas-grid">
                            {turmas.map((turma) => (
                                <div key={turma.id} className="turma-card">
                                    <div className="card-top-badges">
                                        <div className="subject-icon-badge icon-badge--blue">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="info-badge info-badge--students">
                                            <Users size={16} /> {turma.subjects.length} matéria(s)
                                        </div>
                                        <div className="info-badge info-badge--status status--active">
                                            ATIVO
                                        </div>
                                    </div>

                                    <div className="card-title-group">
                                        <h2>{turma.name}</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                                            {turma.subjects.map((sub) => (
                                                <span key={sub.id} className="subject-name">
                                                    {sub.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="card-actions-quick">
                                        <button
                                            className="btn-quick"
                                            onClick={() => navigate(`/teacher/turmas/${turma.id}?tab=notas`)}
                                        >
                                            Lançar Notas
                                        </button>
                                        <button
                                            className="btn-quick"
                                            onClick={() => navigate(`/teacher/turmas/${turma.id}?tab=alunos&action=observacao`)}
                                        >
                                            Lançar Observação
                                        </button>
                                    </div>
                                    <button
                                        className="btn-select-turma"
                                        onClick={() => navigate(`/teacher/turmas/${turma.id}`)}
                                    >
                                        Selecionar Turma
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
