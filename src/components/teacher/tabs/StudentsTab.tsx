import { FileText } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import type { DataTableFilterMeta } from 'primereact/datatable';
import '../../../styles/Admin.css';

export function StudentsTab({
    studentsInClass,
    currentTurmaName,
    selectedStudentIds,
    onSelectionChange,
    onNavigateToGrades
}: any) {
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const header = (
        <div className="search-header">
            <InputText
                className="global-search"
                placeholder="Pesquisar estudante..."
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
            value={studentsInClass}
            selectionMode="checkbox"
            selection={studentsInClass.filter((s: any) => selectedStudentIds.includes(s.id))}
            onSelectionChange={(e) => onSelectionChange(e.value.map((s: any) => s.id))}
            dataKey="id"
            paginator
            rows={10}
            filters={filters}
            globalFilterFields={['name', 'registration', 'status']}
            header={header}
            emptyMessage="Nenhum aluno encontrado."
            filterDisplay="menu"
            removableSort
            size="large"
            className="datatable"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            onFilter={(e) => setFilters(e.filters)}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column
                field="urlImage"
                header="Foto"
                body={(row: any) => (
                    <img
                        src={row.urlImage}
                        alt={row.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                )}
            />
            <Column
                field="name"
                header="Estudante"
                sortable
                filter
                filterPlaceholder="Por nome"
                body={(row: any) => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.name}</span>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{row.email}</span>
                    </div>
                )}
            />
            <Column
                field="registration"
                header="Matrícula"
                sortable
                filter
                filterPlaceholder="Por matrícula"
                body={(row: any) => (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#475569' }}>
                        {row.registration || 'MAT-202301'}
                    </span>
                )}
            />
            <Column
                header="Turma"
                body={() => (
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{currentTurmaName}</span>
                )}
            />
            <Column
                field="status"
                header="Status"
                sortable
                filter
                filterPlaceholder="Por status"
                body={(row: any) => {
                    const st = row.status || 'Ativo';
                    return (
                        <span className={`status-badge ${st === 'Ativo' ? 'status-active' : 'status-inactive'}`}>
                            {st}
                        </span>
                    );
                }}
            />
            <Column
                header="Ações"
                body={(_row: any) => (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-table-action" title="Ver Notas" onClick={onNavigateToGrades}><FileText size={16} /></button>
                    </div>
                )}
            />
        </DataTable>
    );
}
