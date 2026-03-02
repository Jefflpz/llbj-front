import React from 'react';
import { Inbox, FileText } from 'lucide-react';
import { observationsData, observationStudentData } from '../../../data/mockObservations';

const getObservationTypeLabel = (type: '1' | '2' | '3') => {
    switch (type) {
        case '1': return 'Comportamento';
        case '2': return 'Desempenho Acadêmico';
        case '3': return 'Atraso / Frequência';
        default: return 'Outro';
    }
};

const getObservationTypeClass = (type: '1' | '2' | '3') => {
    switch (type) {
        case '1': return 'obs-type-1';
        case '2': return 'obs-type-2';
        case '3': return 'obs-type-3';
        default: return '';
    }
};

export function ObservationsTab({ classId, refreshTrigger }: { classId: number, refreshTrigger: number }) {
    // We use refreshTrigger just to trick React into re-evaluating the component when mock data changes
    React.useEffect(() => { }, [refreshTrigger]);

    // Filter observations for this class
    const classObservations = observationsData.filter(obs => obs.class_id === classId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (classObservations.length === 0) {
        return (
            <div className="empty-state">
                <Inbox size={48} color="#cbd5e1" />
                <h3>Nenhuma observação enviada</h3>
                <p>As observações enviadas para esta turma aparecerão aqui.</p>
            </div>
        );
    }

    return (
        <div className="students-list-wrapper">
            <table className="students-table">
                <thead>
                    <tr>
                        <th>TIPO</th>
                        <th>DATA / HORA</th>
                        <th>QTD ALUNOS</th>
                        <th>PROFESSOR</th>
                        <th style={{ textAlign: 'right' }}>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {classObservations.map(obs => {
                        // Count linked students via N:N relation
                        const studentCount = observationStudentData.filter(link => link.observation_id === obs.id).length;
                        const dateObj = new Date(obs.created_at);
                        const dateStr = dateObj.toLocaleDateString();
                        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <tr key={obs.id}>
                                <td>
                                    <span className={`status-badge ${getObservationTypeClass(obs.type)}`}>
                                        {getObservationTypeLabel(obs.type)}
                                    </span>
                                </td>
                                <td>
                                    <span className="registration-cell">{dateStr} {timeStr}</span>
                                </td>
                                <td>
                                    <span className="class-cell">{studentCount} aluno(s)</span>
                                </td>
                                <td>
                                    <span className="registration-cell">{obs.teacher_registration}</span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-table-action" title="Ver Detalhes (Mensagem e Alunos)">
                                            <FileText size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
