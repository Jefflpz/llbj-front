import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import './TeacherTurmas.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import { turmasData } from '../../data/mockTurmas';
import {
    Search,
    ChevronDown,
    Users,
    Clock,
} from 'lucide-react';

const today = new Date();

function formatDate(date: Date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}


export default function TeacherTurmas() {
    const dateLabel = formatDate(today);
    const navigate = useNavigate();

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Minhas Turmas' },
                        ]} />
                        <h1><strong>Minhas Turmas</strong></h1>
                        <p>{dateLabel}</p>
                    </div>
                </header>

                <div className="turmas-container">
                    <div className="search-filters-row">
                        <div className="search-bar-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Pesquisar professor por nome, matrícula ou disciplina..."
                                className="search-input"
                            />
                        </div>
                        <button className="dropdown-filter">
                            Disciplina <ChevronDown size={16} />
                        </button>
                        <button className="dropdown-filter">
                            Status <ChevronDown size={16} />
                        </button>
                        <button className="dropdown-filter">
                            Turno <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="turmas-grid">
                        {turmasData.map((turma) => (
                            <div key={turma.id} className={`turma-card ${!turma.active ? 'turma-card--inactive' : ''}`}>
                                <div className="card-top-badges">
                                    <div className={`subject-icon-badge ${turma.iconClass}`}>
                                        <turma.icon size={24} />
                                    </div>
                                    <div className="info-badge info-badge--students">
                                        <Users size={16} /> {turma.students} alunos
                                    </div>
                                    {turma.shift && (
                                        <div className="info-badge info-badge--shift">
                                            <Clock size={16} /> {turma.shift}
                                        </div>
                                    )}
                                    <div className={`info-badge info-badge--status ${turma.active ? 'status--active' : 'status--inactive'}`}>
                                        {turma.active ? 'ATIVO' : 'INDISPONÍVEL'}
                                    </div>
                                </div>

                                <div className="card-title-group">
                                    <h2>{turma.name}</h2>
                                    <span className="subject-name">{turma.subject}</span>
                                    {turma.level && <span className="subject-level">{turma.level}</span>}
                                </div>

                                {turma.active ? (
                                    <>
                                        <div className="card-actions-quick">
                                            <button
                                                className="btn-quick"
                                                onClick={() => navigate(`/teacher/turmas/${turma.id}/notas`)}
                                            >
                                                Lancar notas
                                            </button>
                                            <button className="btn-quick">Lancar Observação</button>
                                        </div>
                                        <button
                                            className="btn-select-turma"
                                            onClick={() => navigate(`/teacher/turmas/${turma.id}`)}
                                        >
                                            Selecionar Turma
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn-select-turma btn-select-turma--inactive">
                                        Aguardando Matrículas
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
