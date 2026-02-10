import '../styles/Initial.css'
import ButtonRedirect from '../components/Buttons/Button-redirect';

export default function Initial() {
    return (
        <div className="initial-page">
            <div className="initial-card"> 
                <img src="/llbj-logo.svg" alt="Logo Colégio" id="logo-escola"/>
                <h1>Um futuro melhor para seus filhos!</h1>
                <p>Nossa escola é um espaço onde o conhecimento, os valores e o <br></br>respeito caminham juntos na construção do futuro.</p>
                <div className="container">
                    <img src="/criancas.png" alt="Crianças com livro" id="criancas"/>
                    <span className="initial-login">
                        <img src="/coruja.svg" alt="Coruja LLBJ" id="coruja-foto"/>
                        <ButtonRedirect title='Comece aqui!' redirect='/login'></ButtonRedirect>
                        <p>Encontre experiências reais e vá além dos livros!</p>
                    </span>
                    {/* <img src="/adolescente.png" alt="Adolescente com livro" id="adolescente"/>  */}
                </div>
            </div>
            <div className="information-card">
                <div className="students">
                    <span>
                        <img src="/escola-icone.svg" alt="Ícone escola" />
                        +7,5 mil
                    </span>
                    <br />
                    alunos prontos para novas experiências
                </div>
                <div className="school-position">
                    <span>
                        <img src="/livro-icone.svg" alt="Ícone livro" />
                        #10
                    </span>
                    <br />
                    melhor escola de São Paulo
                </div>
                <div className="medals">
                    <span>
                        <img src="/trofeu-icone.svg" alt="Ícone trofeu" />
                        +50
                    </span>
                    <br />
                    medalhas em olimpíadas científicas
                </div>
            </div>
        </div>
    );
}