import { Sidebar } from '../../components/sidebar/Sidebar';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, MoreVertical, User, FileText, Mail } from 'lucide-react';
import { turmasData } from '../../data/mockTurmas';
import { studentsData } from '../../data/mockStudents';
import './TeacherClassDetails.css';

const today = new Date();

function formatDate(date: Date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export default function TeacherClassDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dateLabel = formatDate(today);

    const currentTurma = turmasData.find(t => t.id === Number(id));
    const studentsInClass = studentsData.filter(s => s.classId === Number(id));

    if (!currentTurma) {
        return <div>Turma não encontrada</div>;
    }

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Minhas Turmas', path: '/teacher/turmas' },
                            { label: currentTurma.name },
                        ]} />
                        <div className="header-with-back">
                            <button onClick={() => navigate('/teacher/turmas')} className="btn-back">
                                <ChevronLeft size={24} />
                            </button>
                            <h1><strong>Alunos - {currentTurma.name}</strong></h1>
                        </div>
                        <p>{dateLabel}</p>
                    </div>
                </header>

                <div className="class-details-container">
                    {/* Filter section exactly as in the reference image */}
                    <div className="filters-container">
                        <div className="search-bar-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Pesquisar estudante por nome, matrícula ou disciplina..."
                                className="search-input"
                            />
                        </div>
                        <div className="dropdown-filters">
                            <select className="filter-select">
                                <option>Departamento</option>
                            </select>
                            <select className="filter-select">
                                <option>Status</option>
                            </select>
                            <select className="filter-select">
                                <option>Turno</option>
                            </select>
                        </div>
                    </div>

                    <div className="students-list-wrapper">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>ESTUDANTE</th>
                                    <th>MATRÍCULA</th>
                                    <th>TURMA</th>
                                    <th>STATUS</th>
                                    <th style={{ textAlign: 'right' }}>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsInClass.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="student-info-cell">
                                                <img src={student.urlImage} alt={student.name} className="student-avatar" />
                                                <div className="student-details">
                                                    <h3>{student.name}</h3>
                                                    <span>{student.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="registration-cell">{(student as any).registration || 'MAT-202301'}</span>
                                        </td>
                                        <td>
                                            <span className="class-cell">{currentTurma.name}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${((student as any).status || 'Ativo').toLowerCase()}`}>
                                                {(student as any).status || 'Ativo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn-table-action" title="Ver Perfil">
                                                    <User size={18} />
                                                </button>
                                                <button
                                                    className="btn-table-action"
                                                    title="Ver Notas"
                                                    onClick={() => navigate(`/teacher/turmas/${id}/notas`)}
                                                >
                                                    <FileText size={18} />
                                                </button>
                                                <button className="btn-table-action" title="Enviar Mensagem">
                                                    <Mail size={18} />
                                                </button>
                                                <button className="btn-table-action" title="Mais Opções">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination-footer">
                            <span className="count-info">Exibindo {studentsInClass.length} de {studentsInClass.length} estudantes</span>
                            <div className="pagination-controls">
                                <button className="page-btn arrow"><ChevronLeft size={18} /></button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <button className="page-btn arrow"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
