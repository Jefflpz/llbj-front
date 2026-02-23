import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';

export default function SubjectsAdmin() {
    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <h1><strong>Disciplinas</strong></h1>
                        <p>Gerenciamento de Matérias (Área em construção)</p>
                    </div>
                </header>

                <section className="filters-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#9ca3af' }}>
                    <h3>Nesta área será possível administrar as disciplinas de cada turma.</h3>
                </section>
            </main>
        </div>
    );
}
