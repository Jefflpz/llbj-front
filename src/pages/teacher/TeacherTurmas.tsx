import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export default function TeacherTurmas() {
    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Turmas' },
                        ]} />
                        <h1><strong>Turmas</strong></h1>
                        <p>Gerenciamento de turmas (Área em construção)</p>
                    </div>
                </header>

                <section className="filters-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#9ca3af' }}>
                    <h3>Nesta área será possível visualizar e gerenciar suas turmas.</h3>
                </section>
            </main>
        </div>
    );
}
