import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CirclePlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { studentsService } from '../../services/students.service';
import type { Student } from '../../services/students.service';
import '../../styles/Admin.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';

export default function StudentsAdmin() {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentsService.findAll();
            setStudents(response);
        } catch (error) {
            console.error("Erro ao carregar alunos", error);
        }
    };

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
        className: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const header = (
        <div className="search-header">
            <InputText
                className="global-search"
                placeholder="Pesquisar..."
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        global: {
                            value: e.target.value,
                            matchMode: FilterMatchMode.CONTAINS,
                        },
                    })
                }
            />
        </div>
    );

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/' },
                            { label: 'Administração' },
                            { label: 'Alunos' }
                        ]} />
                        <h1><strong>Alunos</strong></h1>
                        <p>Gerenciamento de Alunos matriculados nas Turmas.</p>
                    </div>
                    <div className="header-buttons">
                        <button className="btn-save">
                            <CirclePlus size={18} /> Novo Registro
                        </button>
                    </div>
                </header>

                <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0F172A' }}>
                    <DataTable
                        value={students}
                        paginator
                        filters={filters}
                        globalFilterFields={['name', 'email', 'registration', 'className', 'status']}
                        header={header}
                        emptyMessage="Nenhum aluno encontrado."
                        rows={10}
                        filterDisplay="menu"
                        removableSort
                        size="large"
                        className="datatable"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        onFilter={(e) => setFilters(e.filters)}
                    >
                        <Column
                            field="urlImage"
                            header="Foto"
                            body={(row: Student) => (
                                <img
                                    src={row.urlImage || 'https://ui-avatars.com/api/?name=' + row.name}
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
                            body={(row: Student) => (
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
                            body={(row: Student) => (
                                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#475569' }}>
                                    {row.registration}
                                </span>
                            )}
                        />
                        <Column
                            field="className"
                            header="Turma"
                            sortable
                            filter
                            filterPlaceholder="Por turma"
                            body={(row: Student) => (
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{row.className || 'Não associada'}</span>
                            )}
                        />
                        <Column
                            field="status"
                            header="Status"
                            sortable
                            filter
                            filterPlaceholder="Por status"
                            body={(row: Student) => {
                                const st = row.status || 'Ativo';
                                return (
                                    <span className={`status-badge ${st === 'Ativo' ? 'status-active' : 'status-inactive'}`}>
                                        {st}
                                    </span>
                                );
                            }}
                        />
                    </DataTable>
                </section>
            </main>
        </div>
    );
}
