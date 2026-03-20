import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Clock, Save, Loader2 } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth } from '../../../auth/AuthContext';
import { useSubjects } from '../../../hooks/useSubjects';
import { useGrades } from '../../../hooks/useGrades';
import type { GradeRequest } from '../../../services/grades.service';
import '../../../styles/Admin.css';

type GradesTabProps = {
    classId: number;
    studentsInClass: { id: string; name: string; urlImage?: string }[];
};

export function GradesTab({ classId, studentsInClass }: GradesTabProps) {
    const { user } = useAuth();
    const { data: subjects, loading: loadingSubjects } = useSubjects(classId, user?.registration);

    const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');

    useEffect(() => {
        if (subjects && subjects.length > 0 && selectedSubjectId === '') {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    const { data: fetchedGrades, loading: loadingGrades, save } = useGrades(Number(selectedSubjectId) || 0);

    const [localGrades, setLocalGrades] = useState<Record<string, { n1?: string; n2?: string; n3?: string }>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        if (!fetchedGrades) return;
        const newLocal: Record<string, { n1?: string; n2?: string; n3?: string }> = {};
        fetchedGrades.forEach(g => {
            newLocal[g.studentId] = {
                n1: g.n1 != null ? String(g.n1) : '',
                n2: g.n2 != null ? String(g.n2) : '',
                n3: g.n3 != null ? String(g.n3) : ''
            };
        });
        setLocalGrades(newLocal);
    }, [fetchedGrades]);

    const handleGradeChange = (studentId: string, field: 'n1' | 'n2' | 'n3', value: string) => {
        setLocalGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!selectedSubjectId) return;
        setIsSaving(true);
        try {
            const dataToSave: GradeRequest[] = studentsInClass.map(s => {
                const lg = localGrades[s.id] || {};
                return {
                    studentId: s.id,
                    subjectId: Number(selectedSubjectId),
                    n1: lg.n1 && lg.n1 !== '' ? parseFloat(lg.n1) : null,
                    n2: lg.n2 && lg.n2 !== '' ? parseFloat(lg.n2) : null,
                    n3: lg.n3 && lg.n3 !== '' ? parseFloat(lg.n3) : null,
                };
            });
            await save(dataToSave as any);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const calcAverage = (n1?: string, n2?: string, n3?: string): string | null => {
        if (!n1 && !n2 && !n3) return null;
        let sum = 0;
        let count = 0;
        if (n1 && n1 !== '') { sum += parseFloat(n1); count++; }
        if (n2 && n2 !== '') { sum += parseFloat(n2); count++; }
        if (n3 && n3 !== '') { sum += parseFloat(n3); count++; }
        if (count === 0) return null;
        return (sum / count).toFixed(1);
    };

    const dataTableData = useMemo(() => {
        return studentsInClass.map(s => {
            const lg = localGrades[s.id] || {};
            const avg = calcAverage(lg.n1, lg.n2, lg.n3);
            return {
                id: s.id,
                name: s.name,
                avatar: s.urlImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`,
                n1: lg.n1 || '',
                n2: lg.n2 || '',
                n3: lg.n3 || '',
                average: avg,
                hasAnyGrade: lg.n1 || lg.n2 || lg.n3
            };
        });
    }, [studentsInClass, localGrades]);


    if (loadingSubjects) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Carregando disciplinas...</div>;
    }

    if (!subjects || subjects.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Nenhuma disciplina associada a você nesta turma.</div>;
    }

    const GradeCell = ({ studentId, field, value }: { studentId: string; field: 'n1' | 'n2' | 'n3'; value: string }) => (
        <div style={{ display: 'flex' }}>
            <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={value}
                placeholder="--"
                onChange={(e) => handleGradeChange(studentId, field, e.target.value)}
                style={{
                    width: '65px',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.4rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    background: '#f8fafc',
                    outline: 'none',
                }}
            />
        </div>
    );

    const buttonDisabled = isSaving || !selectedSubjectId;

    return (
        <div className="grades-tab-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grades-tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="subject-selector">
                    <label style={{ fontSize: '0.9rem', color: '#64748b', marginRight: '0.5rem' }}>Disciplina:</label>
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    >
                        {subjects.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn-nova-observacao"
                    onClick={handleSave}
                    disabled={buttonDisabled}
                    style={{
                        background: savedSuccess
                            ? 'linear-gradient(90deg, #16a34a, #15803d)'
                            : undefined,
                        opacity: buttonDisabled ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: buttonDisabled ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSaving ? <Loader2 size={18} className="spin" /> : (savedSuccess ? <CheckCircle size={18} /> : <Save size={18} />)}
                    {isSaving ? 'Salvando...' : (savedSuccess ? 'Notas Salvas!' : 'Salvar Notas')}
                </button>
            </div>

            {loadingGrades ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Carregando notas...</div>
            ) : (
                <DataTable
                    value={dataTableData}
                    removableSort
                    size="large"
                    className="datatable"
                    emptyMessage="Nenhum aluno encontrado."
                >
                    <Column
                        field="name"
                        header="Estudante"
                        sortable
                        body={(row: any) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={row.avatar} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {row.id}</span>
                                </div>
                            </div>
                        )}
                    />
                    <Column header="N1" body={(row: any) => <GradeCell studentId={row.id} field="n1" value={row.n1} />} />
                    <Column header="N2" body={(row: any) => <GradeCell studentId={row.id} field="n2" value={row.n2} />} />
                    <Column header="N3" body={(row: any) => <GradeCell studentId={row.id} field="n3" value={row.n3} />} />
                    <Column
                        header="Média"
                        body={(row: any) => {
                            const avg = row.average;
                            return (
                                <div style={{ display: 'flex' }}>
                                    <span style={{
                                        padding: '0.3rem 0.9rem',
                                        borderRadius: '50px',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        background: avg ? '#EFF6FF' : '#F1F5F9',
                                        color: avg ? '#2563EB' : '#94A3B8',
                                        border: `1px solid ${avg ? '#BFDBFE' : '#E2E8F0'}`,
                                        transition: 'all 0.2s ease',
                                    }}>
                                        {avg || '--'}
                                    </span>
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="status"
                        header="Status"
                        sortable
                        body={(row: any) => {
                            const isSalvo = !!row.hasAnyGrade;
                            return (
                                <div style={{ display: 'flex' }}>
                                    <span
                                        className={`status-badge ${isSalvo ? 'status-active' : 'status-inactive'}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}
                                    >
                                        {isSalvo ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {isSalvo ? 'Salvo' : 'Pendente'}
                                    </span>
                                </div>
                            );
                        }}
                    />
                </DataTable>
            )}
        </div>
    );
}
