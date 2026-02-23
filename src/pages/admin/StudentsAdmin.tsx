import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';

export default function StudentsAdmin() {
    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <h1><strong>Alunos</strong></h1>
                        <p>Gerenciamento de Estudantes (Área em construção)</p>
                    </div>
                </header>

                <section className="filters-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#9ca3af' }}>
                    <h3>Nesta área será possível administrar os alunos matriculados e acessos.</h3>
                </section>
            </main>
        </div>
    );
}
