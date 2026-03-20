import { Sidebar } from '../../components/sidebar/Sidebar';
import '../../styles/Admin.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { teacherService } from '../../services/teacher.service';
import { accountService } from '../../services/account.service';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import type { DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

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
        const account = accountList.find((a) => a.username === teacher.email);
        return {
          ...teacher,
          accountId: account ? account.id : 0,
        };
      });

      setTeachers(enrichedTeachers);
    } catch (error) {
      console.warn('Falha ao enriquecer professores com contas:', error);
      const teacherList = await teacherService.findAll();
      setTeachers(teacherList.map(t => ({ ...t, accountId: (t as any).accountId || 0 })) as Teacher[]);
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

  const handleDelete = async (registration: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await teacherService.delete(registration);
      loadTeachers();
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
          const registrations = allTeachers
            .map((t) => t.registration)
            .filter((r) => r.startsWith('PROF-'));

          if (registrations.length > 0) {
            const maxNum = Math.max(
              ...registrations.map((r) => {
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

      alert('Professor salvo com sucesso!');
      setVisible(false);
      setSelectedTeacher(null);
      loadTeachers();
    } catch (error: any) {
      console.error('Erro ao salvar professor:', error);
      alert(
        `Erro ao salvar professor: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  const actions = (rowData: Teacher) => (
    <div className="actions-column">
      <button className="btn-edit" onClick={() => handleEdit(rowData)}>
        <Pencil size={18} />
      </button>
      <button className="btn-delete" onClick={() => handleDelete(rowData.registration)}>
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
