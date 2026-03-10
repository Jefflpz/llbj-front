import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { ObservationModal } from '../../components/modals/ObservationModal';
import { classesService } from '../../services/classes.service';
import { studentsService } from '../../services/students.service';
import { observationService } from '../../services/observations.service';
import { useAuth } from '../../auth/AuthContext';
import { useSubjects } from '../../hooks/useSubjects';
import { StudentsTab } from '../../components/teacher/tabs/StudentsTab';
import { ObservationsTab } from '../../components/teacher/tabs/ObservationsTab';
import { GradesTab } from '../../components/teacher/tabs/GradesTab';
import './TeacherClassDetails.css';

const today = new Date();

function formatDate(date: Date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}


export default function TeacherClassDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const dateLabel = formatDate(today);

    const [currentTurma, setCurrentTurma] = useState<{ id: number; name: string } | null>(null);
    const [studentsInClass, setStudentsInClass] = useState<{ id: string; name: string; urlImage?: string | undefined }[]>([]);

    const classId = Number(id) || 0;
    const { data: subjects } = useSubjects(classId, user?.registration);

    // Attempt to display first related subject
    const headerSubjectName = subjects && subjects.length > 0 ? ` - ${subjects[0].name}` : '';

    useEffect(() => {
        classesService.findById(classId).then(setCurrentTurma).catch(() => setCurrentTurma(null));
        studentsService.findByClass(classId)
            .then((students) => setStudentsInClass(students.map((s) => ({ ...s, urlImage: s.urlImage ?? undefined }))))
            .catch(() => setStudentsInClass([]));
    }, [classId]);

    // Determine active tab from URL query params (default to 'alunos')
    const activeTab = searchParams.get('tab') || 'alunos';

    const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (searchParams.get('action') === 'observacao') {
            setSearchParams({ tab: 'alunos' });
            setIsObservationModalOpen(true);
            setSelectedStudentIds(studentsInClass.map(s => s.id));
        }
    }, [searchParams, studentsInClass.length, setSearchParams]);

    const handleTabChange = (tabName: string) => {
        setSearchParams({ tab: tabName });
    };

    const handleSendObservation = async (type: 'TYPE_1' | 'TYPE_2' | 'TYPE_3', message: string, selectedIds: string[]) => {
        if (!currentTurma) return;
        try {
            await observationService.create({
                classId: currentTurma.id,
                teacherRegistration: 'PROF-Logado', // TODO: usar registration do usuário logado
                message,
                type,
                studentIds: selectedIds,
            });
        } catch (e) {
            console.error('Erro ao criar observação:', e);
        }
        setRefreshTrigger(prev => prev + 1);
        handleTabChange('observacoes');
    };

    // Navigation handler that can be passed to children component
    const onNavigateToGrades = () => {
        handleTabChange('notas');
    };

    if (!currentTurma) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Carregando turma...</div>;
    }

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Minhas Turmas', path: '/teacher/turmas' },
                            { label: currentTurma.name },
                        ]} />
                        <div className="header-title-group">
                            <button onClick={() => navigate('/teacher/turmas')} className="btn-back">
                                <ChevronLeft size={24} />
                            </button>
                            <h1><strong>{currentTurma.name}{headerSubjectName}</strong></h1>
                        </div>
                        <p>{dateLabel}</p>
                    </div>

                    {activeTab === 'alunos' && (
                        <div className="header-buttons">
                            {selectedStudentIds.length > 0 && (
                                <span style={{ color: '#64748b', fontSize: '0.9rem', marginRight: '1rem' }}>
                                    {selectedStudentIds.length} selecionado(s)
                                </span>
                            )}
                            <button
                                className="btn-nova-observacao"
                                onClick={() => {
                                    if (selectedStudentIds.length === 0) {
                                        setSelectedStudentIds(studentsInClass.map(s => s.id));
                                    }
                                    setIsObservationModalOpen(true);
                                }}
                            >
                                <Plus size={18} />
                                {selectedStudentIds.length > 0 ? 'Lançar Observação em Lote' : 'Lançar Observações'}
                            </button>
                        </div>
                    )}
                </header>

                {/* Tabs Navigation */}
                <div className="tabs-navigation">
                    <button
                        className={`tab-item ${activeTab === 'alunos' ? 'tab-item--active' : ''}`}
                        onClick={() => handleTabChange('alunos')}
                    >
                        Alunos
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'observacoes' ? 'tab-item--active' : ''}`}
                        onClick={() => handleTabChange('observacoes')}
                    >
                        Observações Enviadas
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'notas' ? 'tab-item--active' : ''}`}
                        onClick={() => handleTabChange('notas')}
                    >
                        Notas
                    </button>
                </div>

                <div className="class-details-container">

                    {activeTab === 'alunos' && (
                        <StudentsTab
                            studentsInClass={studentsInClass}
                            currentTurmaName={currentTurma.name}
                            selectedStudentIds={selectedStudentIds}
                            onSelectionChange={setSelectedStudentIds}
                            onNavigateToGrades={onNavigateToGrades}
                        />
                    )}

                    {activeTab === 'observacoes' && (
                        <ObservationsTab classId={currentTurma.id} refreshTrigger={refreshTrigger} />
                    )}

                    {activeTab === 'notas' && (
                        <GradesTab classId={currentTurma.id} studentsInClass={studentsInClass} />
                    )}

                </div>
            </main>

            {/* Modal de Observação */}
            <ObservationModal
                isOpen={isObservationModalOpen}
                onClose={() => setIsObservationModalOpen(false)}
                currentTurma={currentTurma}
                studentsInClass={studentsInClass}
                selectedStudentIds={selectedStudentIds}
                onRecipientChange={setSelectedStudentIds}
                onSend={handleSendObservation}
            />
        </div>
    );
}
