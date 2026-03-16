import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { teacherService } from '../../services/teacher.service';
import '../../styles/Admin.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

interface Teacher {
  urlImage: string;
  name: string;
  email: string;
  registration: string;
  subject: string;
  status: string;
  accountId: number;
}

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
    null,
  );

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const response = await teacherService.findAll();
    setTeachers(response as any);
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

  const handleCreate = () => {
    setSelectedTeacher({
      urlImage: '',
      name: '',
      email: '',
      registration: '',
      subject: '',
      status: '',
      accountId: 0
    } as any);
    setVisible(true);
  };

  const handleDelete = async (accountId: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await teacherService.delete(accountId.toString());
      loadTeachers();
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setVisible(true);
  };

  const actions = (rowData: Teacher) => (
    <div className="actions-column">
      <button className="btn-edit" onClick={() => handleEdit(rowData)}>
        <Pencil size={18} />
      </button>
      <button className="btn-delete" onClick={() => handleDelete(rowData.accountId)}>
        <Trash2 size={18} />
      </button>
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
            <button className="btn-save" onClick={() => handleCreate()}>
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
            <Column header="Ações" body={actions} />
          </DataTable>
        </section>
      </main>

      <Dialog
        header={
          !selectedTeacher?.accountId ? 'Criar Professor' : 'Editar Professor'
        }
        visible={visible}
        dismissableMask
        className="modal"
        onHide={() => {
          setVisible(false);
          setSelectedTeacher(null);
        }}
      >
        {selectedTeacher && (
          <div className="modal-fields">
            <div className="field">
              <label>Foto</label>
              <InputText
                value={selectedTeacher.urlImage}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    urlImage: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>Nome</label>
              <InputText
                value={selectedTeacher.name}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>E-mail</label>
              <InputText
                value={selectedTeacher.email}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>Disciplina</label>
              <InputText
                value={selectedTeacher.subject}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    subject: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>Status</label>
              <InputText
                value={selectedTeacher.status}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    status: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn-save"
              onClick={async () => {
                if (!selectedTeacher?.accountId) {
                  await teacherService.create(selectedTeacher);
                } else {
                  await teacherService.update(
                    selectedTeacher?.accountId.toString(),
                    selectedTeacher,
                  );
                }
                alert('Disciplina salva com sucesso!');
                setVisible(false);
                loadTeachers();
              }}
            >
              Salvar
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
