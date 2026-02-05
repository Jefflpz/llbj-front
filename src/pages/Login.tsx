import '../styles/login.css';

export default function Login() {
    return (
        <div className="login-page">
            <div className="login-card-login">
                <form action="">
                    <img src="/llbj-logo.svg" alt="Logo Colégio" />
                    <input type="text" placeholder='Digite seu usuário' />
                    <input type="password" placeholder='Digite sua senha' />
                    <button type='submit'>Fazer Login</button>
                    <a href="#">1° Acesso? Clique aqui!</a>
                </form>
            </div>
        </div>
    );
}