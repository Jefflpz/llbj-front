import { useMemo } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { timetableService } from '../../services/timetable.service';
import { useSubjects } from '../../hooks/useSubjects';
import './Schedule.css';

interface ScheduleProps {
  classId?: number;
}

export default function WeeklySchedule({ classId }: ScheduleProps) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const { data: subjects = [] } = useSubjects(classId);

  // Define fetchers para slots e grade
  const slotsFetcher = useMemo(() => () => timetableService.getSlots('Manhã'), []);
  const { data: slots = [] } = useQuery(slotsFetcher);

  const timetableFetcher = useMemo(() => {
    return classId ? () => timetableService.getTimetable(classId, 'Manhã') : () => Promise.resolve([]);
  }, [classId]);

  const { data: timetableItems = [], loading: loadingTimetable } = useQuery(timetableFetcher, [classId]);

  // Extract unique periods from slots
  const periods = useMemo(() => {
    const sList = slots || [];
    const uniqueStarts = Array.from(new Set(sList.filter(s => !s.is_break).map(s => s.start_time)));
    return uniqueStarts.sort();
  }, [slots]);

  const schedules = useMemo(() => {
    const items = timetableItems || [];
    const subs = subjects || [];

    return items.map(item => {
      const subject = subs.find(s => s.id === item.subject_id);

      let color = '#E2E8F0'; // Default gray
      if (subject?.name?.toLowerCase().includes('matemática')) color = '#E2E9FF';
      else if (subject?.name?.toLowerCase().includes('português')) color = '#FFF5E2';
      else if (subject?.name?.toLowerCase().includes('história')) color = '#E2FBE5';
      else if (subject?.name?.toLowerCase().includes('geografia')) color = '#F4E2FF';
      else if (subject?.name?.toLowerCase().includes('ciência')) color = '#FFE2E2';

      return {
        day: item.day_of_week,
        time: item.start_time,
        subjectName: subject?.name || 'Desconhecido',
        teacherName: subject?.teacherRegistration || 'Desconhecido',
        color
      };
    });
  }, [timetableItems, subjects, slots]);

  return (
    <div className="schedule-card-inner">
      <div className="schedule-header">
        <h3>Horário de Aulas</h3>
        {loadingTimetable && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>Carregando...</span>}
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
