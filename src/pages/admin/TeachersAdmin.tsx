import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CirclePlus, Pencil, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { teacherService } from '../../services/teacher.service';
import { accountService } from '../../services/account.service';
import { subjectsService } from '../../services/subjects.service';
import { observationService } from '../../services/observations.service';
import { gradesService } from '../../services/grades.service';
import { agendaService } from '../../services/agenda.service';
import { quizzesService } from '../../services/quizzes.service';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';

interface Teacher {
  urlImage: string | null;
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
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [successData, setSuccessData] = useState({ title: '', message: '' });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const [teacherList, accountList] = await Promise.all([
        teacherService.findAll(),
        accountService.findAll(),
      ]);

      const enrichedTeachers: Teacher[] = teacherList.map((teacher: any) => {
        const account = accountList.find((a: any) => a.username === teacher.email);
        return {
          ...teacher,
          accountId: account ? account.id : 0,
        };
      });

      setTeachers(enrichedTeachers);
    } catch (error) {
      console.warn('Falha ao enriquecer professores com contas:', error);
      const teacherList = await teacherService.findAll();
      setTeachers(
        (teacherList as any[]).map((t: any) => ({
          ...t,
          accountId: (t as any).accountId || 0,
        })) as Teacher[],
      );
    }
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
      status: 'Ativo',
      accountId: 0,
    });
    setIsEditing(false);
    setVisible(true);
  };

  const handleDelete = (rowData: Teacher) => {
    setTeacherToDelete(rowData);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!teacherToDelete) return;
    setDeleteVisible(false);

    try {
      // 1. Delete associated observations
      const obs = await observationService.findAll();
      const teacherObs = obs.filter(
        (o) => o.teacherRegistration === teacherToDelete.registration,
      );
      for (const o of teacherObs) {
        await observationService.delete(o.id);
      }

      // 2. Delete associated subjects and their dependencies
      const subjects = await subjectsService.findByTeacher(
        teacherToDelete.registration,
      );
      for (const s of subjects) {
        // 2.1 Delete grades
        const grades = await gradesService.findBySubject(s.id);
        for (const g of grades) {
          await gradesService.delete(g.studentId, s.id);
        }

        // 2.2 Delete quizzes
        const quizzes = await quizzesService.findBySubject(s.id);
        for (const q of quizzes) {
          await quizzesService.delete(q.id);
        }

        // 2.3 Delete agendas and materials
        const agendas = await agendaService.findAgendas(s.id);
        for (const a of agendas) {
          const materials = await agendaService.findMaterials(a.id);
          for (const m of materials) {
            await agendaService.deleteMaterial(m.id);
          }
          await agendaService.deleteAgenda(a.id);
        }

        // 2.4 Finally delete the subject
        await subjectsService.delete(s.id);
      }

      // 3. Delete the teacher
      await teacherService.delete(teacherToDelete.registration);

      // 4. Delete the account
      if (teacherToDelete.accountId && teacherToDelete.accountId !== 0) {
        await accountService.delete(teacherToDelete.accountId);
      }

      setSuccessData({
        title: 'Excluído!',
        message: 'O professor e todos os dados associados foram removidos com sucesso.',
      });
      setSuccessVisible(true);
      loadTeachers();
    } catch (error: any) {
      console.error('Erro ao excluir professor:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: `Erro ao excluir professor: ${error.response?.data?.message || error.message}`,
        life: 5000,
      });
    } finally {
      setTeacherToDelete(null);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher({ ...teacher });
    setIsEditing(true);
    setVisible(true);
  };

  const handleSave = async () => {
    if (!selectedTeacher) return;

    try {
      if (isEditing) {
        let accountId = selectedTeacher.accountId;

        if (!accountId || accountId === 0) {
          try {
            const accounts = await accountService.findAll();
            const account = accounts.find((a) => a.username === selectedTeacher.email);
            if (account) {
              accountId = account.id;
            } else {
              const newAcc = await accountService.create({
                username: selectedTeacher.email,
                password: '123456',
                role: 'TEACHER',
              });
              accountId = newAcc.id;
            }
          } catch (e) {
            console.error('Erro ao recuperar/criar conta para o professor:', e);
          }
        }

        await teacherService.update(selectedTeacher.registration, {
          ...selectedTeacher,
          accountId: accountId || 0,
        } as any);
      } else {
        // 1. Generate registration
        const allTeachers = await teacherService.findAll();
        let nextReg = 'PROF-001';

        if (allTeachers.length > 0) {
          const registrations = (allTeachers as any[])
            .map((t: any) => t.registration as string)
            .filter((r: string) => r.startsWith('PROF-'));

          if (registrations.length > 0) {
            const maxNum = Math.max(
              ...registrations.map((r: string) => {
                const num = parseInt(r.replace('PROF-', ''), 10);
                return isNaN(num) ? 0 : num;
              }),
            );
            nextReg = `PROF-${String(maxNum + 1).padStart(3, '0')}`;
          }
        }

        // 2. Create account
        const account = await accountService.create({
          username: selectedTeacher.email,
          password: '123456',
          role: 'TEACHER',
        });

        // 3. Create teacher
        await teacherService.create({
          ...selectedTeacher,
          registration: nextReg,
          accountId: account.id,
        } as any);
      }

      setSuccessData({
        title: isEditing ? 'Alterado!' : 'Cadastrado!',
        message: `O professor foi ${isEditing ? 'alterado' : 'cadastrado'} com sucesso no sistema.`,
      });
      setSuccessVisible(true);
      setVisible(false);
      setSelectedTeacher(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Erro ao salvar professor:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: `Erro ao salvar professor: ${error.response?.data?.message || error.message}`,
        life: 5000,
      });
    }
  };

  const actions = (rowData: Teacher) => (
    <div className="actions-column">
      <button className="btn-edit" onClick={() => handleEdit(rowData)}>
        <Pencil size={18} />
      </button>
      <button
        className="btn-delete"
        onClick={() => handleDelete(rowData)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="timetable-admin-page">
      <Toast ref={toast} />

      <Dialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        closable={false}
        showHeader={false}
        className="custom-confirm-dialog"
        style={{ width: '450px' }}
      >
        <div className="delete-modal-content">
          <div className="delete-modal-icon-container">
            <AlertTriangle size={32} />
          </div>
          <h3 className="delete-modal-title">Confirmar Exclusão</h3>
          <p className="delete-modal-text">
            Tem certeza que deseja excluir o professor{' '}
            <strong>{teacherToDelete?.name}</strong>?
            <br />
            Esta ação é irreversível e removerá todas as disciplinas e notas
            vinculadas.
          </p>
          <div className="delete-modal-actions">
            <button
              onClick={() => setDeleteVisible(false)}
              className="btn-delete-cancel"
            >
              Cancelar
            </button>
            <button onClick={confirmDelete} className="btn-delete-confirm">
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
                  src={rowData.urlImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(rowData.name)}&background=random`}
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
        header={isEditing ? 'Editar Professor' : 'Criar Professor'}
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
              <select
                value={selectedTeacher.status}
                className="input-modal"
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    status: e.target.value,
                  })
                }
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="field">
              <label>Foto (URL)</label>
              <InputText
                value={selectedTeacher.urlImage}
                className="input-modal"
                placeholder="https://..."
                onChange={(e) =>
                  setSelectedTeacher({
                    ...selectedTeacher,
                    urlImage: e.target.value,
                  })
                }
              />
            </div>

            <button className="btn-save" onClick={handleSave}>
              Salvar
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
