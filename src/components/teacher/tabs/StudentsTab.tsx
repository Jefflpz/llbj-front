import { Search, ChevronLeft, ChevronRight, MoreVertical, User, FileText, Mail } from 'lucide-react';

export function StudentsTab({
    studentsInClass,
    currentTurmaName,
    selectedStudentIds,
    handleSelectAll,
    handleSelectStudent,
    onNavigateToGrades
}: any) {
    return (
        <>
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
                            <th style={{ width: '40px' }}>
                                <input
                                    type="checkbox"
                                    className="table-checkbox"
                                    checked={selectedStudentIds.length === studentsInClass.length && studentsInClass.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>ESTUDANTE</th>
                            <th>MATRÍCULA</th>
                            <th>TURMA</th>
                            <th>STATUS</th>
                            <th style={{ textAlign: 'right' }}>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsInClass.map((student: any) => (
                            <tr key={student.id} className={selectedStudentIds.includes(student.id) ? 'row-selected' : ''}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="table-checkbox"
                                        checked={selectedStudentIds.includes(student.id)}
                                        onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                                    />
                                </td>
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
                                    <span className="registration-cell">{student.registration || 'MAT-202301'}</span>
                                </td>
                                <td>
                                    <span className="class-cell">{currentTurmaName}</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${(student.status || 'Ativo').toLowerCase()}`}>
                                        {student.status || 'Ativo'}
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
                                            onClick={onNavigateToGrades}
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
        </>
    );
}
