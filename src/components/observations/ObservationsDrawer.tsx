import { useEffect, useState } from 'react';
import { observationService } from '../../services/observations.service';
import { teacherService } from '../../services/teacher.service';
import '../../styles/Observations.css';

interface Props {
  open: boolean;
  onClose: () => void;
  studentId: string;
}

const colorMap: any = {
  TYPE_1: { border: '#82CC1D', bg: '#82CC1D' },
  TYPE_2: { border: '#FACF23', bg: '#FACF23' },
  TYPE_3: { border: '#FF8943', bg: '#FF8943' },
};

export default function ObservationsDrawer({
  open,
  onClose,
  studentId,
}: Props) {
  const [observations, setObservations] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);

      Promise.all([
        observationService.findByStudentId(studentId),
        teacherService.findAll(),
      ])
        .then(([obsRes, teachRes]) => {
          setObservations(obsRes);
          setTeachers(teachRes);
        })
        .catch((err) => console.error('Erro na sincronização:', err))
        .finally(() => setLoading(false));
    }
  }, [open, studentId]);

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        <header className="drawer-header">
          <h1>Minhas Observações</h1>
          <p className="current-date">Sábado, 21 de Fevereiro, 2026</p>
        </header>

        <div className="timeline-container">
          {loading ? (
            <p className="empty-msg">Carregando Observações...</p>
          ) : (
            observations.map((obs) => {
              const styles = colorMap[obs.type] || colorMap.TYPE_1;

              const professor = teachers.find(
                (t) => t.registration === obs.teacherRegistration,
              );

              return (
                <div key={obs.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="dot"></div>
                    <div className="line"></div>
                  </div>

                  <div className="obs-wrapper">
                    <span className="obs-date-label">
                      {new Date(obs.date).toLocaleDateString('pt-BR')}
                    </span>

                    <div
                      className="obs-card"
                      style={{ border: `2px solid ${styles.border}` }}
                    >
                      <div className="obs-user-row">
                        <img src={professor?.urlImage} alt="Prof" />
                        <span
                          className="teacher-badge"
                          style={{ backgroundColor: styles.bg }}
                        >
                          Prof. {obs.teacherName}
                        </span>
                      </div>
                      <p className="obs-text">{obs.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
