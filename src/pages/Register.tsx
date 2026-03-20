import '../styles/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AtSign, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function Register() {
    const [matricula, setMatricula] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Cadastro validado com sucesso!');
        navigate('/login');
    };

    return (
        <div className="login-page">
            <button className="back-button" onClick={() => navigate('/login')}>
                <ArrowLeft size={20} />
            </button>

            <div className="login-container">
                <div className="login-form-side">
                    <div className="login-header">
                        <img src="/owl.svg" alt="Logo" className="logo" />
                        <h1>Vamos começar!</h1>
                        <p>Utilize seus dados escolares para liberar sua conta no portal.</p>
                    </div>

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="input-group">
                            <label>
                                Matrícula
                                <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 500, paddingTop: '0.1rem' }}>Informe a matrícula fornecida pela secretaria.</span>
                            </label>
                            <div className="input-field">
                                <input
                                    type="text"
                                    className="no-icon-input"
                                    placeholder="gha27dg1269df1"
                                    value={matricula}
                                    onChange={(e) => setMatricula(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Nome</label>
                            <div className="input-field">
                                <input
                                    type="text"
                                    className="no-icon-input"
                                    placeholder="exemplo ex. exemplo"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>E-mail</label>
                            <div className="input-field">
                                <AtSign size={18} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="exemplo@escola.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
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

                        <button type="submit" className="btn-primary-login" style={{ marginTop: '0.5rem' }}>Entrar</button>

                        <div className="divider" style={{ margin: '0.25rem 0' }}>Ja acessou??</div>

                        <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
                            Primeiro Acesso
                        </button>
                    </form>
                </div>

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
