import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useStudent } from '../../hooks/useStudent';
import { Sidebar } from '../../components/sidebar/Sidebar';
import SubjectCard from '../../components/subjects/SubjectCard';
import SubjectDetail from '../../components/subjects/SubjectDetail';
import '../../styles/Subjects.css';

export default function SubjectsPage() {
  const { student, loading: studentLoading } = useStudent();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const idTurma = student?.classId || student?.class_id;

    if (idTurma) {
      api
        .get('/subjects')
        .then((res) => {
          const filtered = res.data.filter((s: any) => s.classId === idTurma);
          setSubjects(filtered);

          if (filtered.length > 0 && !selectedId) {
            setSelectedId(filtered[0].id);
          }
        })
        .catch((err) => console.error('Erro ao buscar disciplinas:', err));
    }
  }, [student, selectedId]);

  const currentSubject = subjects.find((s) => s.id === selectedId);

  if (studentLoading) return <div>Carregando...</div>;

  return (
    <div className="student-layout">
      {' '}
      <Sidebar />
      <main className="student-content">
        <div className="subjects-layout">
          <aside className="subjects-sidebar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Pesquise a disciplina..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="subjects-list">
              {subjects
                .filter((s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((sub) => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    active={selectedId === sub.id}
                    onClick={() => setSelectedId(sub.id)}
                  />
                ))}
            </div>
          </aside>

          <section className="subject-main-content">
            {currentSubject ? (
              <SubjectDetail
                subject={currentSubject}
                studentId={student?.studentId || student?.id}
              />
            ) : (
              <div className="empty-state">
                <p>Nenhuma disciplina encontrada ou selecionada.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
