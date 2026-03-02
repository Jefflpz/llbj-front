import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { turmasData } from '../../data/mockTurmas';
import { studentsData } from '../../data/mockStudents';
import { ObservationModal } from '../../components/modals/ObservationModal';
import { addObservationTransaction } from '../../data/mockObservations';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const dateLabel = formatDate(today);

    const currentTurma = turmasData.find(t => t.id === Number(id));
    const studentsInClass = studentsData.filter(s => s.classId === Number(id));

    // Determine active tab from URL query params (default to 'alunos')
    const activeTab = searchParams.get('tab') || 'alunos';

    const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    // We add a dummy state to force re-render when a new observation is added (since we mutate the mock directly)
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

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedStudentIds(studentsInClass.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectStudent = (studentId: string, checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(prev => [...prev, studentId]);
        } else {
            setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
        }
    };

    const handleSendObservation = (type: '1' | '2' | '3', message: string, selectedIds: string[]) => {
        if (!currentTurma) return;
        addObservationTransaction(currentTurma.id, 'PROF-Logado', message, type, selectedIds);
        setRefreshTrigger(prev => prev + 1); // Force tab re-render to fetch new data
        handleTabChange('observacoes'); // Switch to history tab to see it
    };

    // Navigation handler that can be passed to children component
    const onNavigateToGrades = () => {
        handleTabChange('notas');
    };

    if (!currentTurma) {
        return <div>Turma não encontrada</div>;
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
                        <div className="header-with-back">
                            <div className="header-title-group">
                                <button onClick={() => navigate('/teacher/turmas')} className="btn-back">
                                    <ChevronLeft size={24} />
                                </button>
                                <h1><strong>Acadêmico - {currentTurma.name}</strong></h1>
                            </div>
                            {activeTab === 'alunos' && (
                                <button
                                    className="btn-nova-observacao"
                                    onClick={() => setIsObservationModalOpen(true)}
                                >
                                    <Plus size={18} />
                                    Lançar Observação
                                </button>
                            )}
                        </div>
                        <p>{dateLabel}</p>
                    </div>
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
                            handleSelectAll={handleSelectAll}
                            handleSelectStudent={handleSelectStudent}
                            onNavigateToGrades={onNavigateToGrades}
                        />
                    )}

                    {activeTab === 'observacoes' && (
                        <ObservationsTab classId={currentTurma.id} refreshTrigger={refreshTrigger} />
                    )}

                    {activeTab === 'notas' && (
                        <GradesTab />
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
