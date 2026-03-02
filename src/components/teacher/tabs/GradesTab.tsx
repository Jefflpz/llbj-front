import { CheckCircle, Clock } from 'lucide-react';

const studentsGradesData = [
    {
        id: '202301',
        name: 'Ana Beatriz Silva',
        avatar: 'https://i.pravatar.cc/150?u=202301',
        n1: '8.5',
        n2: '9.0',
        n3: null,
        average: null,
        status: 'Pendente'
    },
    {
        id: '202302',
        name: 'Carlos Eduardo Oliveira',
        avatar: 'https://i.pravatar.cc/150?u=202302',
        n1: '7.0',
        n2: '6.5',
        n3: '8.0',
        average: '7.2',
        status: 'Salvo'
    },
    {
        id: '202303',
        name: 'Fernanda Souza Lima',
        avatar: 'https://i.pravatar.cc/150?u=202303',
        n1: '9.5',
        n2: '10.0',
        n3: '9.0',
        average: '9.5',
        status: 'Salvo'
    },
    {
        id: '202304',
        name: 'João Pedro Santos',
        avatar: 'https://i.pravatar.cc/150?u=202304',
        n1: '6.0',
        n2: null,
        n3: null,
        average: null,
        status: 'Pendente'
    }
];

export function GradesTab() {
    return (
        <div className="grades-container">
            <div className="grades-table-card">
                <table className="grades-table">
                    <thead>
                        <tr>
                            <th>ESTUDANTE</th>
                            <th className="text-center">N1</th>
                            <th className="text-center">N2</th>
                            <th className="text-center">N3</th>
                            <th className="text-center">MÉDIA</th>
                            <th className="text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsGradesData.map((student) => (
                            <tr key={student.id}>
                                <td>
                                    <div className="student-info">
                                        <img src={student.avatar} alt={student.name} className="student-avatar" />
                                        <div className="student-details">
                                            <span className="student-name">{student.name}</span>
                                            <span className="student-id">ID: {student.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="grade-input-wrapper">
                                        <input type="text" defaultValue={student.n1 || ''} className="grade-input" />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="grade-input-wrapper">
                                        <input type="text" defaultValue={student.n2 || ''} className="grade-input" />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="grade-input-wrapper">
                                        <input type="text" defaultValue={student.n3 || ''} placeholder="--" className="grade-input" />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span className={`average-badge ${student.average ? 'average-filled' : ''}`}>
                                        {student.average || '--'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className={`status-badge ${student.status.toLowerCase()}`}>
                                        {student.status === 'Salvo' ? (
                                            <><CheckCircle size={16} /> Salvo</>
                                        ) : (
                                            <><Clock size={16} /> Pendente</>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
