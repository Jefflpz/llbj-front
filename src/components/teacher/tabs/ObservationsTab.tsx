import React, { useState } from 'react';
import { FileText, Inbox } from 'lucide-react';
import { useObservations } from '../../../hooks/useObservations';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';
import '../../../styles/Admin.css';

const getObservationTypeLabel = (type: string) => {
    switch (type) {
        case 'TYPE_1': return 'Comportamento';
        case 'TYPE_2': return 'Desempenho Acadêmico';
        case 'TYPE_3': return 'Atraso / Frequência';
        default: return 'Outro';
    }
};

const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    'TYPE_1': { bg: '#FEF9C3', color: '#854D0E', border: '#FDE68A' },
    'TYPE_2': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    'TYPE_3': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
};

export function ObservationsTab({ classId, refreshTrigger }: { classId: number; refreshTrigger: number }) {
    const { data: rawObservations, loading } = useObservations(classId);

    React.useEffect(() => { }, [refreshTrigger]);

    const classObservations = (rawObservations ?? []).map((obs) => {
        const date = new Date(obs.createdAt);
        return {
            ...obs,
            dateStr: date.toLocaleDateString(),
            timeStr: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            studentCount: obs.studentIds?.length ?? 0,
        };
    });

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        teacherRegistration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Carregando observações...</div>;
    }

    if (classObservations.length === 0) {
        return (
            <div className="empty-state">
                <Inbox size={48} color="#cbd5e1" />
                <h3>Nenhuma observação enviada</h3>
                <p>As observações enviadas para esta turma aparecerão aqui.</p>
            </div>
        );
    }

    const header = (
        <div className="search-header">
            <InputText
                className="global-search"
                placeholder="Pesquisar observação..."
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
                    })
                }
            />
        </div>
    );

    return (
        <DataTable
            value={classObservations}
            paginator
            rows={10}
            filters={filters}
            globalFilterFields={['teacherRegistration', 'dateStr']}
            header={header}
            emptyMessage="Nenhuma observação encontrada."
            removableSort
            size="large"
            className="datatable"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            onFilter={(e) => setFilters(e.filters)}
        >
            <Column
                field="type"
                header="Tipo"
                sortable
                body={(row: any) => {
                    const c = typeColors[row.type] || typeColors['TYPE_1'];
                    return (
                        <span className="status-badge" style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                            {getObservationTypeLabel(row.type)}
                        </span>
                    );
                }}
            />
            <Column
                header="Data / Hora"
                sortable
                body={(row: any) => (
                    <span style={{ fontSize: '0.9rem', color: '#475569' }}>{row.dateStr} {row.timeStr}</span>
                )}
            />
            <Column
                header="Qtd Alunos"
                body={(row: any) => (
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.studentCount} aluno(s)</span>
                )}
            />
            <Column
                field="teacherRegistration"
                header="Professor"
                sortable
                filter
                filterPlaceholder="Por professor"
                body={(row: any) => (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#64748b' }}>{row.teacherName || row.teacherRegistration}</span>
                )}
            />
            <Column
                header="Ações"
                body={() => (
                    <button className="btn-table-action" title="Ver Detalhes"><FileText size={16} /></button>
                )}
            />
        </DataTable>
    );
}
