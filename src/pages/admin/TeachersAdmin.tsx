import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/AdminTimetable.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CirclePlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { teacherService } from '../../services/teacher.service.ts';
import '../../styles/Admin.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';

interface Teacher {
  urlImage: string;
  name: string;
  email: string;
  registration: string;
  subject: string;
  status: string;
}

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const response = await teacherService.findAll();
    setTeachers(response);
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subject: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
            <Breadcrumbs
              items={[
                { label: 'Início', path: '/' },
                { label: 'Administração' },
                { label: 'Professores' },
              ]}
            />
            <h1>
              <strong>Professores</strong>
            </h1>
            <p>Bem-vindo ao painel de controle de professores.</p>
          </div>
          <div className="header-buttons">
            <button className="btn-save">
              <CirclePlus size={18} /> Novo Registro
            </button>
          </div>
        </header>

        <section
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <DataTable
            value={teachers}
            paginator
            filters={filters}
            globalFilterFields={[
              'name',
              'email',
              'registration',
              'subject',
              'status',
            ]}
            header={header}
            emptyMessage="Nenhum professor encontrado."
            filterDisplay="menu"
            rows={5}
            size="large"
            showGridlines
            removableSort
            className="datatable"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            onFilter={(e) => setFilters(e.filters)}
          >
            <Column
              field="urlImage"
              body={(rowData: Teacher) => (
                <img
                  src={rowData.urlImage}
                  alt={rowData.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              )}
              header="Foto"
            ></Column>
            <Column
              field="name"
              header="Nome"
              sortable={true}
              filter
              filterPlaceholder="Procurar por nome"
            ></Column>
            <Column
              field="email"
              style={{ width: '25%' }}
              sortable={true}
              header="E-mail"
              filter
              filterPlaceholder="Procurar por e-mail"
            ></Column>
            <Column
              field="registration"
              header="Matrícula"
              sortable={true}
              filter
              filterPlaceholder="Procurar por matrícula"
            ></Column>
            <Column
              field="subject"
              header="Disciplina"
              sortable={true}
              filter
              filterPlaceholder="Procurar por disciplina"
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable={true}
              filter
              filterPlaceholder="Procurar por status"
            ></Column>
          </DataTable>
        </section>
      </main>
    </div>
  );
}
