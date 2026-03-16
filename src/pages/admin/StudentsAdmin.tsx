import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEffect, useState } from 'react';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import {
  type Student,
  type StudentRequest,
  studentsService,
} from '../../services/students.service.ts';
import { InputNumber } from 'primereact/inputnumber';

export default function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRequest | null>(
    null,
  );

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const response = await studentsService.findAll();
    setStudents(response);
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    setSelectedStudent({
        name: '',
        email: '',
        registration: '',
        classId: 0,
        urlImage: ''
    });
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await studentsService.delete(id);
      loadStudents();
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      name: student.name,
      email: student.email,
      registration: student.registration,
      classId: student.classId,
      urlImage: student.urlImage ?? ''
    });

    setVisible(true);
  };

  const actions = (rowData: Student) => (
    <div className="actions-column">
      <button className="btn-edit" onClick={() => handleEdit(rowData)}>
        <Pencil size={18} />
      </button>
      <button className="btn-delete" onClick={() => handleDelete(rowData.id)}>
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
                { label: 'Alunos' },
              ]}
            />

            <h1>
              <strong>Alunos</strong>
            </h1>
            <p>Gerenciamento de alunos.</p>
          </div>

          <div className="header-buttons">
            <button className="btn-save" onClick={handleCreate}>
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
            value={students}
            paginator
            filters={filters}
            globalFilterFields={['name', 'registration']}
            header={header}
            emptyMessage="Nenhum aluno encontrado."
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
              header="Foto"
              body={(rowData: Student) => (
                <img
                  src={rowData.urlImage ?? ''}
                  alt={rowData.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              )}
            />
            <Column field="id" header="Código" sortable />
            <Column
              field="name"
              header="Nome"
              sortable
              filter
              filterPlaceholder="Procurar por nome"
            />
            <Column
              field="email"
              header="E-mail"
              sortable
              filter
              filterPlaceholder="Procurar por e-mail"
            />
            <Column
              field="registration"
              header="Matrícula"
              sortable
              filter
              filterPlaceholder="Procurar por matrícula"
            />
            <Column
              field="status"
              header="Status"
              sortable
              filter
              filterPlaceholder="Procurar por status"
            />
            <Column
              field="className"
              header="Turma"
              sortable
              filter
              filterPlaceholder="Procurar por nome"
            />
            <Column header="Ações" body={actions} />
          </DataTable>
        </section>
      </main>

      <Dialog
        header={!selectedStudent?.id ? 'Criar Aluno' : 'Editar Aluno'}
        visible={visible}
        dismissableMask
        className="modal"
        onHide={() => {
          setVisible(false);
          setSelectedStudent(null);
        }}
      >
        {selectedStudent && (
          <div className="modal-fields">
            <div className="field">
              <label>URL da Foto</label>
              <InputText
                value={selectedStudent.urlImage}
                className="input-modal"
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    urlImage: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>Nome</label>
              <InputText
                value={selectedStudent.name}
                className="input-modal"
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>E-mail</label>
              <InputText
                value={selectedStudent.email}
                className="input-modal"
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label>Matrícula</label>
              <InputText
                value={selectedStudent.registration}
                className="input-modal"
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    registration: e.target.value,
                  })
                }
              />
            </div>
            <div className="field">
              <label>ID da Turma</label>
              <InputNumber
                value={selectedStudent.classId}
                inputClassName="input-modal"
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    classId: e.value ?? 0,
                  })
                }
              />
            </div>

            <button
              className="btn-save"
              onClick={async () => {
                if (!selectedStudent.id) {
                  await studentsService.create(selectedStudent);
                } else {
                  await studentsService.update(
                    selectedStudent.id,
                    selectedStudent,
                  );
                }

                alert('Aluno salvo com sucesso!');
                setVisible(false);
                loadStudents();
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
