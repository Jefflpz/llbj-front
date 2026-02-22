import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useStudent } from '../../hooks/useStudent';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar() {
  const { logout } = useAuth();
  const { student, loading } = useStudent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="logo-box">
          <img src="/llbj-logo.svg" alt="Logo" className="logo-img" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <button
            className={`nav-link ${location.pathname === '/students' ? 'active' : ''}`}
            onClick={() => navigate('/students')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Início</span>
          </button>

          <button
            className={`nav-link ${location.pathname === '/subjects' ? 'active' : ''}`}
            onClick={() => navigate('/subjects')}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Disciplinas</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        {isMenuOpen && (
          <div className="logout-popover" onClick={logout}>
            <span className="logout-icon">🚪</span>
            <span>Sair da conta</span>
          </div>
        )}

        <div
          className={`profile-card ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="profile-img-wrapper">
            <img
              src={student?.urlImage}
              alt="Avatar"
              className="profile-avatar"
            />
          </div>
          <div className="profile-details">
            <p className="p-name">
              {loading ? '...' : student?.name || 'Usuário'}
            </p>
            <p className="p-class">{student?.className || 'Estudante'}</p>
          </div>
          <span className={`p-arrow ${isMenuOpen ? 'up' : ''}`}>⌄</span>
        </div>
      </div>
    </aside>
  );
}
