import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export default function TeacherHome() {
    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                        ]} />
                        <h1><strong>Início</strong></h1>
                        <p>Bem-vindo à área do professor (Em construção)</p>
                    </div>
                </header>

                <section className="filters-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#9ca3af' }}>
                    <h3>Página inicial do professor.</h3>
                </section>
            </main>
        </div>
    );
}
