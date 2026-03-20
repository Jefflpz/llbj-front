import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useEffect, useState, useRef } from 'react';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { subjectsService } from '../../services/subjects.service.ts';
import {
  CirclePlus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

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
  const [selectedSubject, setSelectedSubject] = useState<SubjectRequest | null>(
    null,
  );
  const [successVisible, setSuccessVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [successData, setSuccessData] = useState({ title: '', message: '' });
  const toast = useRef<Toast>(null);

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

  const handleDelete = (rowData: Subject) => {
    setSubjectToDelete(rowData);
    setConfirmName('');
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setDeleteVisible(false);

    try {
      await subjectsService.delete(subjectToDelete.id);
      setSuccessData({
        title: 'Excluído!',
        message: 'A disciplina foi removida com sucesso do sistema.',
      });
      setSuccessVisible(true);
      loadSubjects();
    } catch (error: any) {
      console.error('Erro ao excluir disciplina:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: `Erro ao excluir: ${error.response?.data?.message || error.message}`,
        life: 5000,
      });
    } finally {
      setSubjectToDelete(null);
      setConfirmName('');
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
      <button className="btn-delete" onClick={() => handleDelete(rowData)}>
        <Trash2 size={18} />
      </button>
    </div>
  );

    return (
      <div className="timetable-admin-page">
        <Toast ref={toast} />
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
          visible={deleteVisible}
          onHide={() => {
            setDeleteVisible(false);
            setConfirmName('');
          }}
          closable={false}
          showHeader={false}
          maskClassName="custom-modal-mask"
          className="custom-confirm-dialog"
          style={{ width: '500px' }}
        >
          <div className="delete-modal-content">
            <div className="delete-modal-icon-container">
              <AlertTriangle size={32} />
            </div>
            <h3 className="delete-modal-title">Confirmar Exclusão</h3>
            <div className="delete-modal-text">
              <p>
                Tem certeza que deseja excluir a disciplina{' '}
                <strong>{subjectToDelete?.name}</strong>?
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: '#64748b' }}>
                Esta ação removerá todos os dados permanentemente.
                <br />
                Digite o nome da disciplina para confirmar:
              </p>
            </div>

            <div className="custom-form-group" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
              <InputText
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={subjectToDelete?.name}
                style={{ textAlign: 'center', fontWeight: 'bold' }}
              />
            </div>

            <div className="delete-modal-actions">
              <button
                onClick={() => {
                  setDeleteVisible(false);
                  setConfirmName('');
                }}
                className="btn-delete-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-delete-confirm"
                disabled={confirmName !== subjectToDelete?.name}
                style={{
                  opacity: confirmName === subjectToDelete?.name ? 1 : 0.5,
                  cursor: confirmName === subjectToDelete?.name ? 'pointer' : 'not-allowed'
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={successVisible}
          onHide={() => setSuccessVisible(false)}
          closable={false}
          showHeader={false}
          maskClassName="custom-modal-mask"
          className="custom-success-dialog"
          style={{ width: '400px' }}
        >
          <div className="success-modal-content">
            <CheckCircle2 size={80} className="success-modal-icon" />
            <h3 className="success-modal-title">{successData.title}</h3>
            <p className="success-modal-text">{successData.message}</p>
            <button
              onClick={() => setSuccessVisible(false)}
              className="btn-success-finish"
            >
              Entendido
            </button>
          </div>
        </Dialog>

        <Dialog
          visible={visible}
          onHide={() => {
            setVisible(false);
            setSelectedSubject(null);
          }}
          showHeader={false}
          maskClassName="custom-modal-mask"
          className="custom-confirm-dialog"
          style={{ width: '500px' }}
        >
          {selectedSubject && (
            <>
              <div className="custom-modal-header">
                <h2>{!selectedSubject.id ? 'Criar Nova Disciplina' : 'Editar Disciplina'}</h2>
                <button
                  className="btn-modal-close"
                  onClick={() => setVisible(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="custom-form-body">
                <div className="custom-form-group">
                  <label>Nome da Disciplina</label>
                  <InputText
                    value={selectedSubject.name}
                    onChange={(e) =>
                      setSelectedSubject({
                        ...selectedSubject,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ex: Física Quântica"
                  />
                </div>

                <div className="custom-form-row">
                  <div className="custom-form-group">
                    <label>Código da Série (classId)</label>
                    <InputText
                      value={selectedSubject.classId.toString()}
                      type="number"
                      onChange={(e) =>
                        setSelectedSubject({
                          ...selectedSubject,
                          classId: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 1"
                    />
                  </div>

                  <div className="custom-form-group">
                    <label>Matrícula do Professor</label>
                    <InputText
                      value={selectedSubject.teacherRegistration}
                      onChange={(e) =>
                        setSelectedSubject({
                          ...selectedSubject,
                          teacherRegistration: e.target.value,
                        })
                      }
                      placeholder="Ex: PROF-001"
                    />
                  </div>
                </div>
              </div>

              <div className="custom-modal-footer">
                <button
                  className="btn-modal-cancel"
                  onClick={() => setVisible(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-modal-save" 
                  onClick={async () => {
                    try {
                      if (!selectedSubject.id) {
                        await subjectsService.create(selectedSubject);
                      } else {
                        await subjectsService.update(
                          selectedSubject.id,
                          selectedSubject
                        );
                      }
                      setSuccessData({
                        title: selectedSubject.id ? 'Alterado!' : 'Cadastrado!',
                        message: `A disciplina foi ${selectedSubject.id ? 'alterada' : 'cadastrada'} com sucesso no sistema.`,
                      });
                      setSuccessVisible(true);
                      setVisible(false);
                      setSelectedSubject(null);
                      loadSubjects();
                    } catch (error: any) {
                      console.error('Erro ao salvar disciplina:', error);
                      toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao salvar: ${error.response?.data?.message || error.message}`,
                        life: 5000,
                      });
                    }
                  }}
                >
                  {selectedSubject.id ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
                </button>
              </div>
            </>
          )}
        </Dialog>
      </div>
    );
}
