import './Schedule.css';

interface ScheduleProps {
  classId?: number;
}

export default function WeeklySchedule({ classId }: ScheduleProps) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const periods = ['07:00', '08:20', '09:10', '10:00', '10:50', '11:40'];

  const hardcodedSchedules: Record<number, any[]> = {
    1: [
      {
        day: 'Segunda',
        time: '07:00',
        subjectName: 'Matemática',
        teacherName: 'Diogo Martins',
        color: '#E2E9FF',
      },
      {
        day: 'Segunda',
        time: '08:20',
        subjectName: 'Matemática',
        teacherName: 'Diogo Martins',
        color: '#E2E9FF',
      },
      {
        day: 'Terça',
        time: '07:00',
        subjectName: 'Português',
        teacherName: 'Marcelo Grilo',
        color: '#FFF5E2',
      },
      {
        day: 'Quarta',
        time: '09:10',
        subjectName: 'História',
        teacherName: 'Marcelo Modolo',
        color: '#E2FBE5',
      },
      {
        day: 'Quinta',
        time: '10:00',
        subjectName: 'Geografia',
        teacherName: 'Carlos Santi',
        color: '#F4E2FF',
      },
      {
        day: 'Sexta',
        time: '11:40',
        subjectName: 'Ciência',
        teacherName: 'Marcio Welker',
        color: '#FFE2E2',
      },
    ],
    2: [
      {
        day: 'Segunda',
        time: '07:00',
        subjectName: 'História',
        teacherName: 'Marcelo Modolo',
        color: '#E2FBE5',
      },
    ],
  };

  const schedules = classId ? hardcodedSchedules[classId] || [] : [];

  return (
    <div className="schedule-card-inner">
      <div className="schedule-header">
        <h3>Horário de Aulas</h3>
      </div>

      <div className="schedule-grid">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Horário</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((time, index) => (
              <tr key={index}>
                <td className="time-col">{time}</td>
                {days.map((day) => {
                  const lesson = schedules.find(
                    (s) => s.day === day && s.time === time,
                  );
                  return (
                    <td
                      key={day}
                      className={lesson ? 'has-lesson' : 'empty-cell'}
                    >
                      {lesson ? (
                        <div
                          className="lesson-box"
                          style={{
                            borderLeft: `4px solid ${lesson.color}`,
                            backgroundColor: `${lesson.color}40`,
                          }}
                        >
                          <span className="subject-name">
                            {lesson.subjectName}
                          </span>
                          <span className="teacher-name">
                            {lesson.teacherName}
                          </span>
                        </div>
                      ) : (
                        <span className="no-lesson">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
