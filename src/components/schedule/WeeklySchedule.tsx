import { useMemo } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { timetableService } from '../../services/timetable.service';
import { useSubjects } from '../../hooks/useSubjects';
import { TimetableGrid } from '../timetable/TimetableGrid';
import { Loader2, CalendarDays } from 'lucide-react';
import '../../styles/AdminTimetable.css';

interface ScheduleProps {
  classId?: number;
  period?: string;
}

export default function WeeklySchedule({ classId, period = 'Manhã' }: ScheduleProps) {
  const { data: subjects = [] } = useSubjects(classId);

  const slotsFetcher = useMemo(() => () => timetableService.getSlots(period), [period]);
  const { data: slots = [] } = useQuery(slotsFetcher, [period]);

  const timetableFetcher = useMemo(() => {
    return classId ? () => timetableService.getTimetable(classId, period) : () => Promise.resolve([]);
  }, [classId, period]);

  const { data: timetableItems = [], loading: loadingTimetable } = useQuery(timetableFetcher, [classId, period]);

  return (
    <div className="timetable-body">
      {loadingTimetable ? (
        <div className="grid-loading-state" style={{ width: '100%', height: '400px' }}>
          <Loader2 className="spinner-icon" size={40} />
          <p>Carregando agenda...</p>
        </div>
      ) : (
        <>
          {(timetableItems || []).length > 0 || (slots || []).length > 0 ? (
            <TimetableGrid
              slots={slots || []}
              items={timetableItems || []}
              subjects={subjects as any}
            />
          ) : (
            <div className="empty-state" style={{ flex: 1, marginTop: '2rem', textAlign: 'center' }}>
              <CalendarDays size={48} color="#cbd5e1" style={{ margin: '0 auto' }} />
              <h3>Nenhuma aula encontrada</h3>
              <p>Você não possui aulas agendadas para o período de {period}.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
