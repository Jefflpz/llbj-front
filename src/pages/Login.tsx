import '../styles/Login.css';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authService.login({ username, password });

      login(res.data);

      const role = res.data.role;

      if (role === 'ADMIN') navigate('/admin');
      if (role === 'TEACHER') navigate('/teacher');
      if (role === 'STUDENT') navigate('/students');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <img src="/llbj-logo.svg" alt="Logo Colégio" />

          <input
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Fazer Login</button>
          <a href="#">1° Acesso? Clique aqui!</a>
        </form>
      </div>
    </div>
  );
}
