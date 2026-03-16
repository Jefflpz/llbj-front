import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {useEffect, useState} from "react";
import  {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {subjectsService} from "../../services/subjects.service.ts";
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import {Column} from "primereact/column";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';

interface Subject {
  id: number;
  name: string;
  classId: number;
  className: string;
  teacherRegistration: string;
  teacherName: string;
}

interface SubjectRequest {
  id?: number;
  name: string;
  classId: number,
  teacherRegistration: string;
}

export default function SubjectsAdmin() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectRequest | null>(null);

  useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        const response = await subjectsService.findAll();
        setSubjects(response as any);
    };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    className: { value: null, matchMode: FilterMatchMode.CONTAINS },
    teacherName: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    setSelectedSubject({
      name: '',
      classId: 0,
      teacherRegistration: ''
    });
    setVisible(true);
  };

    const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await subjectsService.delete(id);
      loadSubjects();
    }
  };

    const handleEdit = (subject: Subject) => {
      setSelectedSubject(subject);
      setVisible(true);
    }

    const actions = (rowData: Subject) => (
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
                  { label: 'Disciplinas' },
                ]}
              />
              <h1>
                <strong>Disciplinas</strong>
              </h1>
              <p>Bem-vindo ao painel de controle de disciplinas.</p>
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
              value={subjects}
              paginator
              filters={filters}
              globalFilterFields={['name', 'className', 'teacherName']}
              header={header}
              emptyMessage="Nenhuma matéria encontrado."
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
                field="name"
                header="Nome"
                sortable={true}
                filter
                filterPlaceholder="Procurar por nome"
              ></Column>
              <Column
                field="id"
                style={{ width: '25%' }}
                sortable={true}
                header="Código"
                // filter
                // filterPlaceholder="Procurar por código"
              ></Column>
              <Column
                field="className"
                header="Série/Ano"
                sortable={true}
                filter
                filterPlaceholder="Procurar por série escolar"
              ></Column>
              <Column
                field="teacherName"
                header="Professor"
                sortable={true}
                filter
                filterPlaceholder="Procurar por professor"
              ></Column>
              <Column
                header="Ações"
                body={actions}
              />
            </DataTable>
          </section>
        </main>

        <Dialog
          header={
            !selectedSubject?.id ? 'Criar Disciplina' : 'Editar Disciplina'
          }
          visible={visible}
          dismissableMask
          className="modal"
          onHide={() => {
            setVisible(false);
            setSelectedSubject(null);
          }}
        >
          {selectedSubject && (
            <div className="modal-fields">
              <div className="field">
                <label>Nome</label>
                <InputText
                  value={selectedSubject.name}
                  className="input-modal"
                  onChange={(e) =>
                    setSelectedSubject({
                      ...selectedSubject,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field">
                <label>Série</label>
                <InputNumber
                  value={selectedSubject.classId}
                  inputClassName="input-modal"
                  onValueChange={(e) =>
                    setSelectedSubject({
                      ...selectedSubject,
                      classId: e.value ?? 0,
                    })
                  }
                />
              </div>

              <div className="field">
                <label>Professor</label>
                <InputText
                  value={selectedSubject.teacherRegistration}
                  className="input-modal"
                  onChange={(e) =>
                    setSelectedSubject({
                      ...selectedSubject,
                      teacherRegistration: e.target.value,
                    })
                  }
                />
              </div>

              <button
                className="btn-save"
                onClick={async () => {
                  if (!selectedSubject.id) {
                    await subjectsService.create(selectedSubject);
                  } else {
                    await subjectsService.update(
                      selectedSubject.id,
                      selectedSubject
                    );
                  }
                  alert('Disciplina salva com sucesso!');
                  setVisible(false);
                  loadSubjects();
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
