import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function SubjectDetail({ subject, studentId }: any) {
  const [grades, setGrades] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    api.get('/grades').then((res) => {
      setGrades(
        res.data.filter(
          (g: any) => g.subjectId === subject.id && g.studentId === studentId,
        ),
      );
    });

    api.get('/teachers').then((res) => {
      setTeacher(
        res.data.find(
          (t: any) => t.registration === subject.teacherRegistration,
        ),
      );
    });
  }, [subject, studentId]);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="detail-container">
      <header className="detail-header-prof">
        <img
          src={
            teacher?.urlImage ||
            `https://ui-avatars.com/api/?name=${subject.teacherName}`
          }
          alt="Prof"
        />
        <div className="prof-text">
          <h2>{subject.name}</h2>
          <p>
            Prof. {subject.teacherName} • {subject.className}
          </p>
        </div>
      </header>

      <section className="grades-grid-container">
        <h3>Desempenho por Bimestre</h3>
        <div className="quarters-wrapper">
          {quarters.map((q, index) => {
            const grade = grades.find((g) => g.quarter === q);
            const value = grade?.value || 0;
            const isPass = value >= 6;

            return (
              <div key={q} className="q-card">
                <span className="q-title">{index + 1}º Bimestre</span>
                <div
                  className="q-value"
                  style={{
                    color:
                      value > 0 ? (isPass ? '#82CC1D' : '#FF8A50') : '#ccc',
                  }}
                >
                  {value > 0 ? value.toFixed(1) : '--'}
                </div>
                <div className="progress-bg">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${value * 10}%`,
                      background: isPass ? '#82CC1D' : '#FF8A50',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
