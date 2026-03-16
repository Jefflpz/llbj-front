import { useState } from 'react';
import { useStudent } from '../../hooks/useStudent';
import { api } from '../../services/api';
import { reportService } from '../../services/report.service';
import WeeklySchedule from '../../components/schedule/WeeklySchedule';
import ObservationsDrawer from '../../components/observations/ObservationsDrawer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Download, Bell, Loader2 } from 'lucide-react';
import '../../styles/AdminTimetable.css';
import '../../styles/StudentsHome.css';

export default function StudentHome() {
  const [openObs, setOpenObs] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [period, setPeriod] = useState<string>('Manhã');
  const { student, loading } = useStudent();

  const handleDownloadReport = async () => {
    if (!student) return;

    setIsDownloading(true);
    try {
      const [subRes, gradeRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/grades'),
      ]);

      console.log(subRes.data)
      console.log(gradeRes.data)

      const subjectsList = Array.isArray(subRes.data) ? subRes.data : (subRes.data.content || []);
      const gradesList = Array.isArray(gradeRes.data) ? gradeRes.data : (gradeRes.data.content || []);

      const mySubjects = subjectsList.filter(
        (s: any) => s.classId === ((student as any).classId || (student as any).class_id),
      );
      const myGrades = gradesList.filter(
        (g: any) => g.studentId === ((student as any).studentId || student.id),
      );

      reportService.generateBoletim(student, mySubjects, myGrades);
    } catch (err) {
      console.error('Erro ao gerar boletim:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="timetable-admin-page">
      <Sidebar />

      <main className="timetable-content">
        <header className="timetable-header">
          <div className="timetable-title">
            <Breadcrumbs items={[
              { label: 'Início', path: '/students' },
              { label: 'Aluno' },
              { label: 'Minha Agenda' }
            ]} />
            <div>
              <h1><strong>Minha Agenda</strong></h1>
              <p>
                Olá, {student?.name?.split(' ')[0] || 'Aluno'}! Veja o que temos para hoje.
              </p>
            </div>
          </div>

          <div className="header-buttons">
            <button
              className="btn-export"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download size={18} />
              {isDownloading ? 'Gerando...' : 'Baixar Boletim'}
            </button>

            <button className="btn-save" onClick={() => setOpenObs(true)} style={{ position: 'relative' }}>
              <Bell size={18} />
              Notificações
              <span className="badge" style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>!</span>
            </button>
          </div>
        </header>

        <section className="filters-row">
          <div className="select-group">
            <div className="select-field">
              <label>Período</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid-loading-state" style={{ height: '400px' }}>
            <Loader2 className="spinner-icon" size={40} />
            <p>Carregando seus dados...</p>
          </div>
        ) : (
          <div className="dashboard-body">
            <WeeklySchedule classId={(student as any)?.classId || (student as any)?.class_id} period={period} />
          </div>
        )}

        <ObservationsDrawer
          open={openObs}
          onClose={() => setOpenObs(false)}
          studentId={(student as any)?.studentId || student?.id}
        />
      </main>
    </div>
  );
}
