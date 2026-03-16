import { useState, useMemo } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BookOpen, Users, ChevronLeft, Target, Calendar, Clock, Loader2, Play, FileText, Download } from 'lucide-react';
import { useStudent } from '../../hooks/useStudent';
import { useSubjects } from '../../hooks/useSubjects';
import { useQuizzes } from '../../hooks/useQuizzes';
import { useAgenda } from '../../hooks/useAgenda';
import { useQuery } from '../../hooks/useQuery';
import { api } from '../../services/api';
import { QuizResolverModal } from '../../components/students/QuizResolverModal';
import '../teacher/TeacherTurmas.css';
import '../teacher/TeacherSubjects.css';

export default function SubjectsPage() {
  const { student, loading: studentLoading } = useStudent();
  const idTurma = (student as any)?.classId || (student as any)?.class_id;
  const studentId = (student as any)?.studentId || student?.id;

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  // Fetch subjects by class
  const { data: subjects, loading: subjectsLoading, error: subjectsError } = useSubjects(idTurma);

  // Fetch details for selected subject
  const { data: quizzesData, loading: loadingQuizzes } = useQuizzes(selectedSubjectId || 0);
  const { data: agendaData, loading: loadingAgenda } = useAgenda(selectedSubjectId || 0);

  // Fetch Grades
  const gradesFetcher = useMemo(() => () => selectedSubjectId ? api.get('/grades').then(r => r.data.filter((g: any) => g.subjectId === selectedSubjectId && g.studentId === studentId)) : Promise.resolve([]), [selectedSubjectId, studentId]);
  const { data: gradesData = [], loading: loadingGrades } = useQuery(gradesFetcher, [selectedSubjectId, studentId]);

  const quizzes = selectedSubjectId ? (quizzesData || []) : [];
  const subjectMaterials = selectedSubjectId ? (agendaData?.materials || []) : [];
  const agendas = selectedSubjectId ? (agendaData?.agendas || []) : [];

  // Derived values
  const currentSubject = subjects?.find(s => s.id === selectedSubjectId);
  const isLoadingGlobal = studentLoading || subjectsLoading;

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
    if (isLoadingGlobal) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#64748b' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Carregando suas disciplinas...</p>
        </div>
      );
    }
    if (subjectsError) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}><p>{subjectsError}</p></div>
      );
    }
    if (!subjects || subjects.length === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem', color: '#94a3b8' }}>
          <BookOpen size={48} />
          <p>Nenhuma disciplina encontrada para sua turma.</p>
        </div>
      );
    }

    return (
      <div className="turmas-container">
        <div className="turmas-grid">
          {subjects.map((turma) => (
            <div key={turma.id} className="turma-card">
              <div className="card-top-badges">
                <div className="subject-icon-badge icon-badge--blue"><BookOpen size={24} /></div>
                <div className="info-badge info-badge--students">
                  <Users size={16} /> Prof. {turma.teacherName || 'Não atribuído'}
                </div>
                <div className="info-badge info-badge--status status--active">ATIVO</div>
              </div>
              <div className="card-title-group">
                <h2>{turma.name}</h2>
                <span className="subject-name">{turma.className}</span>
              </div>
              <button className="btn-select-turma" onClick={() => setSelectedSubjectId(turma.id)}>Acessar Disciplina</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!currentSubject) return null;
    const isLoadingAux = loadingQuizzes || loadingAgenda || loadingGrades;

    return (
      <div className="subject-details-container" style={{ padding: '0 2rem 2rem 2rem' }}>
        <div className="details-content">

          {/* Grades Section (Added for Students) */}
          <div className="details-section bg-transparent mb-8">
            <div className="section-header">
              <div className="section-title-wrapper">
                <Target size={20} className="section-icon text-blue" />
                <h2>Seu Desempenho</h2>
              </div>
            </div>
            {loadingGrades ? (
              <div className="p-8"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="quarters-wrapper" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { title: '1º Trimestre (N1)', key: 'n1' },
                  { title: '2º Trimestre (N2)', key: 'n2' },
                  { title: '3º Trimestre (N3)', key: 'n3' }
                ].map((item) => {
                  const studentGradeRecord = gradesData.length > 0 ? gradesData[0] : null;
                  const value = studentGradeRecord ? studentGradeRecord[item.key] : null;
                  const isPass = value !== null && value >= 6;
                  const color = value !== null ? (isPass ? '#16a34a' : '#ea580c') : '#94a3b8';

                  return (
                    <div key={item.title} className="turma-card" style={{ flex: '1 1 200px', padding: '1.5rem', height: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{item.title}</span>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color }}>
                        {value !== null ? Number(value).toFixed(1) : '--'}
                      </div>
                      <div style={{ height: '6px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: value !== null ? `${Number(value) * 10}%` : '0%', background: color }}></div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Final Average */}
                {(() => {
                  const studentGradeRecord = gradesData.length > 0 ? gradesData[0] : null;
                  let sum = 0;
                  let count = 0;
                  if (studentGradeRecord?.n1 != null) { sum += studentGradeRecord.n1; count++; }
                  if (studentGradeRecord?.n2 != null) { sum += studentGradeRecord.n2; count++; }
                  if (studentGradeRecord?.n3 != null) { sum += studentGradeRecord.n3; count++; }
                  
                  const avg = count > 0 ? sum / count : null;
                  const isPass = avg !== null && avg >= 6;
                  const color = avg !== null ? (isPass ? '#16a34a' : '#ea580c') : '#94a3b8';

                  return (
                    <div className="turma-card" style={{ flex: '1 1 200px', padding: '1.5rem', height: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', border: '2px dashed #cbd5e1' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>Média Final</span>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color }}>
                        {avg !== null ? avg.toFixed(1) : '--'}
                      </div>
                      <div style={{ height: '6px', borderRadius: '4px', background: '#e2e8f0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: avg !== null ? `${avg * 10}%` : '0%', background: color }}></div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}
          </div>

          {/* Materiais Didáticos Section */}
          <div className="details-section bg-transparent">
            <div className="section-header">
              <div className="section-title-wrapper">
                <BookOpen size={20} className="section-icon text-blue" />
                <h2>Materiais de Apoio</h2>
                {!isLoadingAux && <span className="counter-badge">{subjectMaterials.length}</span>}
              </div>
            </div>
            {loadingAgenda ? (
              <div className="p-8"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="cards-list">
                {subjectMaterials.length === 0 ? (
                  <div className="empty-card">Nenhum material disponibilizado ainda.</div>
                ) : (
                  subjectMaterials.map((mat: any) => (
                    <div key={mat.id} className="turma-card" style={{ height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="subject-icon-badge bg-blue-light" style={{ width: '48px', height: '48px', margin: 0 }}>
                          {mat.type === 'PDF' ? <FileText size={24} className="text-blue" /> : <Play size={24} className="text-blue" />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <h2 style={{ fontSize: '1.15rem', color: '#1e293b', margin: '0 0 0.4rem 0' }}>{mat.title}</h2>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="info-badge info-badge--students" style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                              {mat.type}
                            </div>
                            <span className="subject-name" style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{getAgendaName(mat.weekId)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn-select-turma" style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: 0 }}>
                        <Download size={18} style={{ marginRight: '0.5rem' }} /> Baixar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="details-section bg-transparent mt-8">
            <div className="section-header">
              <div className="section-title-wrapper">
                <Target size={20} className="section-icon text-blue" />
                <h2>Avaliações Pendentes</h2>
                {!isLoadingAux && <span className="counter-badge">{quizzes.length}</span>}
              </div>
            </div>
            {loadingQuizzes ? (
              <div className="p-8"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="cards-list">
                {quizzes.length === 0 ? (
                  <div className="empty-card">Nenhuma avaliação cadastrada no momento.</div>
                ) : (
                  quizzes.map((quiz: any) => (
                    <div key={quiz.id} className="turma-card" style={{ height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="subject-icon-badge bg-green-light" style={{ width: '48px', height: '48px', margin: 0 }}>
                          <Target size={24} className="text-green" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                            <h2 style={{ fontSize: '1.15rem', color: '#1e293b', margin: 0 }}>{quiz.title}</h2>
                          </div>
                          <span className="subject-name" style={{ fontSize: '0.9rem', marginBottom: '0.6rem', display: 'block' }}>
                            {quiz.description || `Teste de conhecimentos valendo ${quiz.score} pontos.`}
                          </span>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <span className="subject-level" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                              <Calendar size={14} /> Liberado: {formatDateTime(quiz.releaseDate)}
                            </span>
                            <span className="subject-level" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                              <Clock size={14} /> Entrega: {formatDateTime(quiz.deadline)}
                            </span>
                            <span className="subject-level" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontWeight: 600, color: '#0ea5e9' }}>
                              {quiz.score} Pontos
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn-select-turma" 
                        style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: 0, backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' }}
                        onClick={() => setActiveQuiz(quiz)}
                      >
                        Resolver
                      </button>
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
                { label: 'Início', path: '/' },
                { label: 'Aluno' },
                { label: 'Minhas Disciplinas' },
              ]} />
              <div>
                <h1><strong>Suas Disciplinas</strong></h1>
                <p>Acesse o material, avaliações e progresso de cada matéria.</p>
              </div>
            </div>
          ) : (
            <div className="timetable-title">
              <Breadcrumbs items={[
                { label: 'Início', path: '/' },
                { label: 'Disciplinas', path: '#' },
                { label: currentSubject?.name || 'Detalhes' }
              ]} />
              <div className="header-title-group">
                <button onClick={() => setSelectedSubjectId(null)} className="btn-back">
                  <ChevronLeft size={24} />
                </button>
                <h1><strong>{currentSubject?.name}</strong></h1>
              </div>
              <p>Prof. {currentSubject?.teacherName || 'Não atribuído'}</p>
            </div>
          )}
        </header>

        {selectedSubjectId ? renderDetail() : renderGrid()}

        <QuizResolverModal 
            isOpen={!!activeQuiz}
            quiz={activeQuiz}
            onClose={() => setActiveQuiz(null)}
        />
      </main>
    </div>
  );
}
