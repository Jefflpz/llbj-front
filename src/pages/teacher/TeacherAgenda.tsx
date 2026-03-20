import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Loader2, CalendarDays } from 'lucide-react';
import { timetableService } from '../../services/timetable.service';
import type {
    Subject,
    TimetableItem,
    TimetableSlot,
} from '../../models/timetable.model';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import '../../styles/AdminTimetable.css';

export default function TeacherAgenda() {
    const [loading, setLoading] = useState(true);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [slots, setSlots] = useState<TimetableSlot[]>([]);
    const [timetable, setTimetable] = useState<TimetableItem[]>([]);

    const [selectedPeriod, setSelectedPeriod] = useState<string>('Manhã');

    useEffect(() => {
        loadAgendaData(selectedPeriod);
    }, [selectedPeriod]);

    const loadAgendaData = async (period: string) => {
        setLoading(true);
        try {
            const allClasses = await timetableService.getClasses();
            const classId = allClasses.length > 0 ? allClasses[0].id : 1;

            const [_subjects, _slots, _items] = await Promise.all([
                timetableService.getSubjectsByClass(classId),
                timetableService.getSlots(period),
                timetableService.getTimetable(classId, period),
            ]);

            setSubjects(_subjects);
            setSlots(_slots);
            setTimetable(_items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="timetable-admin-page">
            <Sidebar />

            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Minha Agenda' }
                        ]} />
                        <h1><strong>Minha Agenda</strong></h1>
                        <p>Visualize as suas aulas programadas para a semana.</p>
                    </div>
                </header>

                <section className="filters-row">
                    <div className="select-group">
                        <div className="select-field">
                            <label>Período</label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="grid-loading-state">
                        <Loader2 className="spinner-icon" size={40} />
                        <p>Carregando agenda...</p>
                    </div>
                ) : (
                    <div className="timetable-body">
                        {timetable.length > 0 ? (
                            <TimetableGrid
                                slots={slots}
                                items={timetable}
                                subjects={subjects}
                            />
                        ) : (
                            <div className="empty-state" style={{ flex: 1, marginTop: '2rem' }}>
                                <CalendarDays size={48} color="#cbd5e1" />
                                <h3>Nenhuma aula encontrada</h3>
                                <p>Você não possui aulas agendadas para o período de {selectedPeriod}.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
