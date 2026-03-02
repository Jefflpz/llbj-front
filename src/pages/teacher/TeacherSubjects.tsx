import { useState } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Calendar, Clock, Edit2, Plus, Target, Trash2, ArrowLeft, BookOpen, Users, ChevronLeft, ChevronRight, FileText, Play } from 'lucide-react';
import { quizzesData, deleteQuiz, addQuiz, updateQuiz, type Quiz } from '../../data/mockQuizzes';
import { turmasData } from '../../data/mockTurmas';
import { weeklyAgendasData, classMaterialsData } from '../../data/mockAgenda';
import { QuizFormModal } from '../../components/teacher/disciplinas/QuizFormModal';
import '../teacher/TeacherTurmas.css'; // Reusing card styles
import './TeacherSubjects.css';

export default function TeacherSubjects() {
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

    // Quiz States
    const [quizzes, setQuizzes] = useState<Quiz[]>(quizzesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);

    // Filtered data for Level 2
    const currentSubject = turmasData.find(t => t.id === selectedSubjectId);

    // Quizzes for specific subject
    const subjectQuizzes = quizzes.filter(q => q.subjectId === selectedSubjectId);

    // Materials that belong to agendas tied to this subject
    const agendasForSubject = weeklyAgendasData.filter(a => a.subjectId === selectedSubjectId);
    const agendaIds = agendasForSubject.map(a => a.id);
    const subjectMaterials = classMaterialsData.filter(m => agendaIds.includes(m.weekId));

    const handleCreateNew = () => {
        setQuizToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (quiz: Quiz) => {
        setQuizToEdit(quiz);
        setIsModalOpen(true);
    };

    const handleSaveQuiz = (savedQuiz: Quiz) => {
        if (quizToEdit) {
            updateQuiz(savedQuiz);
        } else {
            addQuiz(savedQuiz);
        }
        setQuizzes([...quizzesData]);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja excluir este Quiz?')) {
            deleteQuiz(id);
            setQuizzes([...quizzesData]);
        }
    };

    const formatDateTime = (isoString: string | null) => {
        if (!isoString) return '--';
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getAgendaName = (weekId: number | null) => {
        if (!weekId) return 'Semana não associada';
        const agenda = weeklyAgendasData.find(a => a.id === weekId);
        return agenda ? agenda.weekName : 'Semana Desconhecida';
    };

    // Level 1: Grid View
    const renderGrid = () => (
        <div className="turmas-container">
            <div className="turmas-grid">
                {turmasData.map((turma) => (
                    <div key={turma.id} className={`turma-card ${!turma.active ? 'turma-card--inactive' : ''}`}>
                        <div className="card-top-badges">
                            <div className={`subject-icon-badge ${turma.iconClass}`}>
                                <turma.icon size={24} />
                            </div>
                            <div className="info-badge info-badge--students">
                                <Users size={16} /> {turma.students} alunos
                            </div>
                            <div className={`info-badge info-badge--status ${turma.active ? 'status--active' : 'status--inactive'}`}>
                                {turma.active ? 'ATIVO' : 'INDISPONÍVEL'}
                            </div>
                        </div>

                        <div className="card-title-group">
                            <h2>{turma.subject}</h2>
                            <span className="subject-name">{turma.name}</span>
                            {turma.level && <span className="subject-level">{turma.level}</span>}
                        </div>

                        {turma.active ? (
                            <button
                                className="btn-select-turma"
                                onClick={() => setSelectedSubjectId(turma.id)}
                            >
                                Acessar Disciplina
                            </button>
                        ) : (
                            <button className="btn-select-turma btn-select-turma--inactive">
                                Aguardando Liberação
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Level 2: Detail View
    const renderDetail = () => {
        if (!currentSubject) return null;

        return (
            <div className="subject-details-container">
                <div className="details-content">
                    {/* Materiais Didáticos Section */}
                    <div className="details-section bg-transparent">
                        <div className="section-header">
                            <div className="section-title-wrapper">
                                <BookOpen size={20} className="section-icon text-blue" />
                                <h2>Materiais Didáticos</h2>
                                <span className="counter-badge">{subjectMaterials.length}</span>
                            </div>
                        </div>
                        <div className="cards-list">
                            {subjectMaterials.length === 0 ? (
                                <div className="empty-card">Nenhum material de apoio cadastrado.</div>
                            ) : (
                                subjectMaterials.map(mat => (
                                    <div key={mat.id} className="item-card">
                                        <div className="item-card-left">
                                            <div className="item-icon-box bg-blue-light">
                                                {mat.type === 'PDF' ? <FileText size={20} className="text-blue" /> : <Play size={20} className="text-blue" />}
                                            </div>
                                            <div className="item-info">
                                                <h3>{mat.title}</h3>
                                                <p>{mat.type} &middot; {getAgendaName(mat.weekId)}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quizzes Section */}
                    <div className="details-section bg-transparent mt-8">
                        <div className="section-header">
                            <div className="section-title-wrapper">
                                <Target size={20} className="section-icon text-blue" />
                                <h2>Quizzes / Avaliações</h2>
                                <span className="counter-badge">{subjectQuizzes.length}</span>
                            </div>
                        </div>
                        <div className="cards-list">
                            {subjectQuizzes.length === 0 ? (
                                <div className="empty-card">Nenhum quiz cadastrado.</div>
                            ) : (
                                subjectQuizzes.map(quiz => (
                                    <div key={quiz.id} className="quiz-card">
                                        <div className="quiz-card-status">
                                            <span className="status-badge status-open"><div className="status-dot"></div> Aberto</span>
                                        </div>
                                        <h3 className="quiz-card-title">{quiz.title}</h3>
                                        <p className="quiz-card-desc">{quiz.description || `Teste seus conhecimentos sobre o conteúdo.`}</p>

                                        <div className="quiz-card-footer">
                                            <div className="quiz-card-dates">
                                                <span className="date-item"><Calendar size={14} /> Liberação: {formatDateTime(quiz.releaseDate)}</span>
                                                <span className="date-item"><Clock size={14} /> Prazo: {formatDateTime(quiz.deadline)}</span>
                                            </div>
                                            <div className="quiz-card-actions">
                                                <button className="btn-action btn-edit" title="Editar Quiz" onClick={() => handleEdit(quiz)}>
                                                    <Edit2 size={14} /> Editar
                                                </button>
                                                <button className="btn-action btn-delete" title="Excluir Quiz" onClick={(e) => handleDelete(quiz.id, e)}>
                                                    <Trash2 size={14} /> Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                    <div className="timetable-title">
                        {!selectedSubjectId ? (
                            <>
                                <Breadcrumbs items={[
                                    { label: 'Início', path: '/teacher/home' },
                                    { label: 'Disciplinas' },
                                ]} />
                                <div className="header-with-action">
                                    <div>
                                        <h1><strong>Disciplinas</strong></h1>
                                        <p>Acesse o material de apoio e cadastre os quizzes de cada disciplina.</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Breadcrumbs items={[
                                    { label: 'Início', path: '/teacher/home' },
                                    { label: 'Disciplinas' },
                                    { label: currentSubject?.name || 'Detalhes' }
                                ]} />
                                <div className="header-with-back">
                                    <div className="header-title-group">
                                        <button onClick={() => setSelectedSubjectId(null)} className="btn-back">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <h1><strong>{currentSubject?.subject} - {currentSubject?.name}</strong></h1>
                                    </div>
                                    <button
                                        className="btn-novo-quiz"
                                        onClick={handleCreateNew}
                                    >
                                        <Plus size={18} />
                                        Criar Quiz
                                    </button>
                                </div>
                                <p>Materiais e avaliações da disciplina</p>
                            </>
                        )}
                    </div>
                </header>

                {selectedSubjectId ? renderDetail() : renderGrid()}

            </main>

            <QuizFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                quizToEdit={quizToEdit}
                onSave={handleSaveQuiz}
                preSelectedSubjectId={selectedSubjectId}
            />
        </div>
    );
}
