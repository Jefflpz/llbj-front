import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useStudent } from '../../hooks/useStudent';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, LayoutGrid, CalendarDays, Users, BookOpen } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { student } = useStudent();
  const { admin } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const profileImage = isAdmin
    ? admin?.urlImage
    : isTeacher
      ? `https://ui-avatars.com/api/?name=${user?.username || 'Teacher'}&background=random`
      : student?.urlImage;

  return (
    <aside className="sidebar-container collapsed">
      <div className="sidebar-header">
        <div className="logo-box">
          <img src="/owl.svg" alt="Logo" className="logo-img" />
          <button className="toggle-btn">
            <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
        <div className="divider-line"></div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">

          {isAdmin ? (
            <>
              {/* ADMIN LINKS */}
              <button
                className={`nav-link ${location.pathname.includes('/admin/teachers') ? 'active' : ''}`}
                onClick={() => navigate('/admin/teachers')}
                title="Professores"
              >
                <div className="nav-icon-wrapper">
                  <img src="/teachers.svg" alt="Teachers" className="nav-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname.includes('/admin/subjects') ? 'active' : ''}`}
                onClick={() => navigate('/admin/subjects')}
                title="Disciplinas"
              >
                <div className="nav-icon-wrapper">
                  <img src="/subjects.svg" alt="Subjects" className="nav-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname.includes('/admin/students') ? 'active' : ''}`}
                onClick={() => navigate('/admin/students')}
                title="Alunos"
              >
                <div className="nav-icon-wrapper">
                  <img src="/students.svg" alt="Students" className="nav-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname.includes('/admin/timetable') ? 'active' : ''}`}
                onClick={() => navigate('/admin/timetable')}
                title="Grade Horária"
              >
                <div className="nav-icon-wrapper">
                  <CalendarDays size={24} color="#515151" className="nav-icon lucide-icon" />
                </div>
              </button>
            </>
          ) : isTeacher ? (
            <>
              {/* TEACHER LINKS */}
              <button
                className={`nav-link ${location.pathname === '/teacher/home' ? 'active' : ''}`}
                onClick={() => navigate('/teacher/home')}
                title="Início"
              >
                <div className="nav-icon-wrapper">
                  <LayoutGrid size={24} color="#515151" className="nav-icon lucide-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname === '/teacher/turmas' ? 'active' : ''}`}
                onClick={() => navigate('/teacher/turmas')}
                title="Turmas"
              >
                <div className="nav-icon-wrapper">
                  <Users size={24} color="#515151" className="nav-icon lucide-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname === '/teacher/subjects' ? 'active' : ''}`}
                onClick={() => navigate('/teacher/subjects')}
                title="Disciplinas"
              >
                <div className="nav-icon-wrapper">
                  <BookOpen size={24} color="#515151" className="nav-icon lucide-icon" />
                </div>
              </button>
            </>
          ) : (
            <>
              {/* STUDENT LINKS */}
              <button
                className={`nav-link ${location.pathname === '/subjects' ? 'active' : ''}`}
                onClick={() => navigate('/subjects')}
                title="Disciplinas"
              >
                <div className="nav-icon-wrapper">
                  <img src="/subjects.svg" alt="Subjects" className="nav-icon" />
                </div>
              </button>

              <button
                className={`nav-link ${location.pathname === '/students' ? 'active' : ''}`}
                onClick={() => navigate('/students')}
                title="Início / Dashboard"
              >
                <div className="nav-icon-wrapper">
                  <LayoutGrid size={24} color="#515151" className="nav-icon lucide-icon" />
                </div>
              </button>
            </>
          )}

        </div>
      </nav>

      <div className="sidebar-footer">
        {isMenuOpen && (
          <div className="logout-popover" onClick={logout}>
            Sair
          </div>
        )}

        <div
          className={`profile-card ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <img
            src={profileImage || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>
      </div>
    </aside>
  );
}
