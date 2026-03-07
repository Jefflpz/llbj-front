import '../styles/Login.css';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ArrowLeft, AtSign, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login({ username, password });
      login(res.data);
      if (res.data.role === 'ADMIN') navigate('/admin/timetable');
      if (res.data.role === 'TEACHER') navigate('/teacher/home');
      if (res.data.role === 'STUDENT') navigate('/students');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="login-page">
      <button className="back-button" onClick={() => navigate('/initial')}>
        <ArrowLeft size={20} />
      </button>

      <div className="login-container">
        {/* Formulário */}
        <div className="login-form-side">
          <div className="login-header">
            <img src="/owl.svg" alt="Logo" className="logo" />
            <h1>Bem-vindo!</h1>
            <p>Gerencie sua jornada educacional de forma inteligente.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>E-mail</label>
              <div className="input-field">
                <AtSign size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="exemplo@escola.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                Senha
                <a href="#">Esqueceu a senha?</a>
              </label>
              <div className="input-field">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-login">Entrar</button>

            <div className="divider">Ainda não acessou?</div>

            <button type="button" className="btn-secondary" onClick={() => navigate('/primeiro-acesso')}>
              Primeiro Acesso
            </button>
          </form>

          <div className="login-footer">
            Não tem uma conta? <a href="#">Entre em contato.</a>
          </div>
        </div>

        {/* Imagem (Hero) */}
        <div className="login-image-side">
          <div className="glass-card">
            <GraduationCap size={40} className="glass-icon" />
            <h2>Potencialize o Futuro</h2>
            <p>Acesse as melhores ferramentas de gestão escolar para professores, alunos e administradores. Tudo em um só lugar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
