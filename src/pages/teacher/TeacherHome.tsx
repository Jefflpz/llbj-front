import { Sidebar } from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import './TeacherHome.css';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../auth/AuthContext';
import {
    User,
    Users,
    Calendar,
    CalendarCheck,
    BookOpen,
    BookMarked,
    Download,
    ArrowUpRight,
    Zap,
    Clock,
} from 'lucide-react';

const today = new Date();

function formatDate(date: Date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

const agendaItems = [
    {
        time: '08:00',
        title: 'Matemática - 9º Ano A',
        subtitle: 'Equações de Segundo Grau',
        tag: 'EM 15 MIN',
        tagColor: '#f59e0b',
        active: true,
    },
    {
        time: '10:30',
        title: 'Geometria - 1º Ano B',
        subtitle: 'Cálculo de Áreas',
        tag: null,
        active: false,
    },
    {
        time: '14:00',
        title: 'Reforço Escolar',
        subtitle: 'Turma Geral de Exatas',
        tag: null,
        active: false,
    },
    {
        time: '18:30',
        title: 'Conselho de Classe',
        subtitle: 'Sala de Reuniões 01',
        tag: null,
        active: false,
    },
];

export default function TeacherHome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const displayName = user?.name || user?.username || 'Professor';
    const dateLabel = formatDate(today);

    return (
        <div className="timetable-admin-page">
            <Sidebar />
            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/teacher/home' },
                            { label: 'Professor' },
                            { label: 'Home' },
                        ]} />
                        <h1><strong>Olá, {displayName}</strong></h1>
                        <p>{dateLabel}</p>
                    </div>
                    <div className="header-date-badge">
                        <Calendar size={16} />
                        <span>{dateLabel}</span>
                    </div>
                </header>

                <div className="teacher-home-body">
                    <div className="teacher-home-main">

                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-icon stat-icon--blue">
                                    <BookMarked size={24} color="#3b82f6" />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">MINHAS TURMAS</span>
                                    <span className="stat-value">12</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon--green">
                                    <User size={24} color="#22c55e" />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">TOTAL DE ALUNOS</span>
                                    <span className="stat-value">340</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon stat-icon--yellow">
                                    <CalendarCheck size={24} color="#f59e0b" />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">AULAS HOJE</span>
                                    <span className="stat-value">4</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions-section">
                            <h2 className="section-title">
                                <Zap size={18} fill="#f59e0b" color="#f59e0b" />
                                Ações Rápidas
                            </h2>
                            <div className="quick-actions-grid">

                                <div className="action-card">
                                    <div className="action-card-header">
                                        <div className="action-icon action-icon--blue">
                                            <Users size={22} color="#3b82f6" />
                                        </div>
                                        <ArrowUpRight size={18} className="action-arrow" />
                                    </div>
                                    <h3 className="action-title">Lista de Alunos</h3>
                                    <p className="action-desc">Gerencie frequências, visualize históricos e adicione observações críticas.</p>
                                    <div className="action-tags">
                                        <button className="tag-btn tag-btn--outline">PESQUISAR</button>
                                        <button className="tag-btn tag-btn--outline">FILTRAR</button>
                                    </div>
                                    <button className="tag-btn tag-btn--blue" onClick={() => navigate('/teacher/turmas')}>+ OBSERVAÇÃO</button>
                                </div>

                                <div className="action-card action-card--highlight">
                                    <div className="action-card-header">
                                        <div className="action-icon action-icon--purple">
                                            <BookOpen size={22} color="#8b5cf6" />
                                        </div>
                                        <ArrowUpRight size={18} className="action-arrow" />
                                    </div>
                                    <h3 className="action-title">Lançar Notas</h3>
                                    <p className="action-desc">Lançamento em massa para provas ou individual para trabalhos e atividades.</p>
                                    <div className="action-footer-row">
                                        <span className="action-badge">PENDÊNCIAS: 12 ALUNOS</span>
                                        <span className="action-badge action-badge--blue">TURMA 9ºB</span>
                                    </div>
                                    <button className="btn-mass-launch">Lançamento em Massa</button>
                                </div>

                                <div className="action-card">
                                    <div className="action-card-header">
                                        <div className="action-icon action-icon--green">
                                            <Download size={22} color="#16a34a" />
                                        </div>
                                        <ArrowUpRight size={18} className="action-arrow" />
                                    </div>
                                    <h3 className="action-title">Baixar Boletim</h3>
                                    <p className="action-desc">Gere e exporte boletins acadêmicos individuais ou por turma em formato PDF.</p>
                                    <button className="btn-report">
                                        <Download size={15} />
                                        Gerar Relatórios
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <aside className="teacher-agenda">
                        <div className="agenda-header">
                            <span className="agenda-title">AGENDA DO DIA</span>
                            <Calendar size={18} color="#6b7280" />
                        </div>
                        <div className="agenda-list">
                            {agendaItems.map((item, idx) => (
                                <div key={idx} className={`agenda-item ${item.active ? 'agenda-item--active' : ''}`}>
                                    <div className="agenda-time">{item.time}</div>
                                    <div className="agenda-dot-col">
                                        <div className={`agenda-dot ${item.active ? 'agenda-dot--active' : ''}`} />
                                        {idx < agendaItems.length - 1 && <div className="agenda-line" />}
                                    </div>
                                    <div className="agenda-info">
                                        <span className="agenda-item-title">{item.title}</span>
                                        <span className="agenda-item-sub">{item.subtitle}</span>
                                        {item.tag && (
                                            <span className="agenda-tag" style={{ color: item.tagColor }}>
                                                <Clock size={11} />
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
