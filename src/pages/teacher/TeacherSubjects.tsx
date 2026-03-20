import { useState } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Calendar, Clock, Edit2, Plus, Target, Trash2, BookOpen, Users, ChevronLeft, FileText, Play, Loader2 } from 'lucide-react';
import { QuizFormModal } from '../../components/teacher/disciplinas/QuizFormModal';
import { useAuth } from '../../auth/AuthContext';
import { useSubjects } from '../../hooks/useSubjects';
import { useQuizzes, type Quiz, type QuizRequest } from '../../hooks/useQuizzes';
import { useAgenda } from '../../hooks/useAgenda';
import '../teacher/TeacherTurmas.css';
import './TeacherSubjects.css';

export default function TeacherSubjects() {
    const { user } = useAuth();
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

    const { data: subjects, loading: loadingSubjects, error: subjectsError } = useSubjects(undefined, user?.registration);

    const { data: quizzesData, loading: loadingQuizzes, create: createQuiz, update: updateQuiz, remove: removeQuiz } = useQuizzes(selectedSubjectId || 0);
    const { data: agendaData, loading: loadingAgenda } = useAgenda(selectedSubjectId || 0);

    const quizzes = selectedSubjectId ? (quizzesData || []) : [];
    const subjectMaterials = selectedSubjectId ? (agendaData?.materials || []) : [];
    const agendas = selectedSubjectId ? (agendaData?.agendas || []) : [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);

    const currentSubject = subjects?.find(t => t.id === selectedSubjectId);

    const handleCreateNew = () => {
        setQuizToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (quiz: Quiz) => {
        setQuizToEdit(quiz);
        setIsModalOpen(true);
    };

    const mockSaveQuiz = async (savedMockQuiz: any) => {
        try {
            const dto: QuizRequest = {
                title: savedMockQuiz.title,
                description: savedMockQuiz.description || '',
                score: savedMockQuiz.score,
                releaseDate: savedMockQuiz.releaseDate,
                deadline: savedMockQuiz.deadline,
                subjectId: savedMockQuiz.subjectId,
                weekId: savedMockQuiz.weekId,
                materialId: savedMockQuiz.materialId,
                questions: savedMockQuiz.questions || []
            };
            if (quizToEdit) {
                await updateQuiz(quizToEdit.id, dto);
            } else {
                await createQuiz(dto);
            }
            setIsModalOpen(false);
        } catch (e) {
            console.error("Error saving quiz:", e);
            alert("Erro ao salvar quiz");
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja excluir este Quiz?')) {
            try {
                await removeQuiz(id);
            } catch (e) {
                console.error(e);
                alert("Erro ao remover o quiz.");
            }
        }
    };

    const formatDateTime = (isoString: string | null) => {
        if (!isoString) return '--';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '--';
        }
    };

    const getAgendaName = (weekId: number | null) => {
        if (!weekId) return 'Semana não associada';
        const agenda = agendas.find(a => a.id === weekId);
        return agenda ? agenda.weekName : 'Semana Desconhecida';
    };

    const renderGrid = () => {
        if (loadingSubjects) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#64748b' }}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Carregando suas disciplinas...</p>
                </div>
            );
        }
        if (subjectsError) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{subjectsError}</p>
                </div>
            );
        }
        if (!subjects || subjects.length === 0) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#94a3b8' }}>
                    <BookOpen size={48} />
                    <p>Nenhuma disciplina encontrada para o seu perfil.</p>
                </div>
            );
        }

        return (
            <div className="turmas-container">
                <div className="turmas-grid">
                    {subjects.map((turma) => (
                        <div key={turma.id} className="turma-card">
                            <div className="card-top-badges">
                                <div className="subject-icon-badge icon-badge--blue">
                                    <BookOpen size={24} />
                                </div>
                                <div className="info-badge info-badge--students">
                                    <Users size={16} /> Turma: {turma.className}
                                </div>
                                <div className="info-badge info-badge--status status--active">
                                    ATIVO
                                </div>
                            </div>

                            <div className="card-title-group">
                                <h2>{turma.name}</h2>
                                <span className="subject-name">{turma.className}</span>
                            </div>

                            <button
                                className="btn-select-turma"
                                onClick={() => setSelectedSubjectId(turma.id)}
                            >
                                Acessar Disciplina
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDetail = () => {
        if (!currentSubject) return null;

        const isLoadingAux = loadingQuizzes || loadingAgenda;

        return (
            <div className="subject-details-container">
                <div className="details-content">
                    <div className="details-section bg-transparent">
                        <div className="section-header">
                            <div className="section-title-wrapper">
                                <BookOpen size={20} className="section-icon text-blue" />
                                <h2>Materiais Didáticos</h2>
                                {!isLoadingAux && <span className="counter-badge">{subjectMaterials.length}</span>}
                            </div>
                        </div>
                        {isLoadingAux ? (
                            <div className="p-8"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : (
                            <div className="cards-list">
                                {subjectMaterials.length === 0 ? (
                                    <div className="empty-card">Nenhum material de apoio cadastrado.</div>
                                ) : (
                                    subjectMaterials.map(mat => (
                                        <div key={mat.id} className="turma-card" style={{ height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div className="subject-icon-badge bg-blue-light" style={{ width: '48px', height: '48px', margin: 0 }}>
                                                    {mat.type === 'PDF' ? <FileText size={24} className="text-blue" /> : <Play size={24} className="text-blue" />}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h2 style={{ fontSize: '1.15rem', color: '#1e293b', margin: '0 0 0.4rem 0' }}>{mat.title}</h2>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div className="info-badge info-badge--students" style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                                                            <BookOpen size={14} /> {mat.type}
                                                        </div>
                                                        <span className="subject-name" style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{getAgendaName(mat.weekId)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn-select-turma" style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: 0 }}>
                                                Acessar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="details-section bg-transparent mt-8">
                        <div className="section-header">
                            <div className="section-title-wrapper">
                                <Target size={20} className="section-icon text-blue" />
                                <h2>Quizzes / Avaliações</h2>
                                {!isLoadingAux && <span className="counter-badge">{quizzes.length}</span>}
                            </div>
                        </div>
                        {isLoadingAux ? (
                            <div className="p-8"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : (
                            <div className="cards-list">
                                {quizzes.length === 0 ? (
                                    <div className="empty-card">Nenhum quiz cadastrado.</div>
                                ) : (
                                    quizzes.map(quiz => (
                                        <div key={quiz.id} className="turma-card" style={{ height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div className="subject-icon-badge bg-green-light" style={{ width: '48px', height: '48px', margin: 0 }}>
                                                    <Target size={24} className="text-green" />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                                                        <h2 style={{ fontSize: '1.15rem', color: '#1e293b', margin: 0 }}>{quiz.title}</h2>
                                                        <div className="info-badge status--active" style={{ backgroundColor: '#DCFCE7', color: '#166534', gap: '0.25rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                                                            <div className="status-dot" style={{ width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }}></div> Aberto
                                                        </div>
                                                    </div>
                                                    <span className="subject-name" style={{ fontSize: '0.9rem', marginBottom: '0.6rem', display: 'block' }}>
                                                        {quiz.description || `Teste de conhecimentos.`}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                        <span className="subject-level" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                                                            <Calendar size={14} /> Liberação: {formatDateTime(quiz.releaseDate)}
                                                        </span>
                                                        <span className="subject-level" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                                                            <Clock size={14} /> Prazo: {formatDateTime(quiz.deadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button className="btn-action btn-edit" style={{ margin: 0 }} onClick={() => handleEdit(quiz)}>
                                                    <Edit2 size={16} /> <span style={{ marginLeft: '0.4rem' }}>Editar</span>
                                                </button>
                                                <button className="btn-action btn-delete" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', margin: 0 }} onClick={(e) => handleDelete(quiz.id, e)}>
                                                    <Trash2 size={16} /> <span style={{ marginLeft: '0.4rem' }}>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    {!selectedSubjectId ? (
                        <div className="timetable-title">
                            <Breadcrumbs items={[
                                { label: 'Início', path: '/teacher/home' },
                                { label: 'Disciplinas' },
                            ]} />
                            <div>
                                <h1><strong>Disciplinas</strong></h1>
                                <p>Acesse o material de apoio e cadastre os quizzes de cada disciplina.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="timetable-title">
                                <Breadcrumbs items={[
                                    { label: 'Início', path: '/teacher/home' },
                                    { label: 'Disciplinas', path: '#' },
                                    { label: currentSubject?.name || 'Detalhes' }
                                ]} />
                                <div className="header-title-group">
                                    <button onClick={() => setSelectedSubjectId(null)} className="btn-back">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <h1><strong>{currentSubject?.name} - {currentSubject?.className}</strong></h1>
                                </div>
                                <p>Materiais e avaliações da disciplina</p>
                            </div>
                            <div className="header-buttons">
                                <button
                                    className="btn-novo-quiz"
                                    onClick={handleCreateNew}
                                >
                                    <Plus size={18} />
                                    Criar Quiz
                                </button>
                            </div>
                        </>
                    )}
                </header>

                {selectedSubjectId ? renderDetail() : renderGrid()}

            </main>

            <QuizFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                quizToEdit={quizToEdit}
                onSave={mockSaveQuiz}
                preSelectedSubjectId={selectedSubjectId}
            />
        </div>
    );
}
