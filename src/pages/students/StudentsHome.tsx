import { useState } from 'react';
import { useStudent } from '../../hooks/useStudent';
import { api } from '../../services/api';
import { reportService } from '../../services/report.service';
import WeeklySchedule from '../../components/schedule/WeeklySchedule';
import ObservationsDrawer from '../../components/observations/ObservationsDrawer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/StudentsHome.css';

export default function StudentHome() {
  const [openObs, setOpenObs] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { student, loading } = useStudent();

  const handleDownloadReport = async () => {
    if (!student) return;

    setIsDownloading(true);
    try {
      const [subRes, gradeRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/grades'),
      ]);

      const mySubjects = subRes.data.filter(
        (s: any) => s.classId === (student.classId || student.class_id),
      );
      const myGrades = gradeRes.data.filter(
        (g: any) => g.studentId === (student.studentId || student.id),
      );

      reportService.generateBoletim(student, mySubjects, myGrades);
    } catch (err) {
      console.error('Erro ao gerar boletim:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="student-layout">
      <Sidebar />

      <main className="student-content">
        <header className="student-header">
          <div className="welcome-section">
            <h1>Sua Semana</h1>
            <p>
              Olá, {student?.name?.split(' ')[0]}! Veja o que temos para hoje.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="download-btn"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <span>{isDownloading ? '⏳' : '📥'}</span>
              {isDownloading ? 'Gerando...' : 'Baixar Boletim'}
            </button>

            <button className="icon-btn" onClick={() => setOpenObs(true)}>
              <span>🔔</span>
              <span className="badge">!</span>
            </button>
          </div>
        </header>

        <div className="dashboard-body">
          <section className="schedule-section">
            <div className="card">
              <WeeklySchedule classId={student?.classId} />
            </div>
          </section>
        </div>

        <ObservationsDrawer
          open={openObs}
          onClose={() => setOpenObs(false)}
          studentId={student?.studentId || student?.id}
        />
      </main>
    </div>
  );
}
