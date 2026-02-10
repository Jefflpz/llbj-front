import '../styles/Initial.css'
import ButtonRedirect from '../components/Buttons/ButtonRedirect';
import InformationCard from '../components/information/InformationCard';
export default function Initial() {
    return (
        <div className="initial-page">
            <div className="initial-card"> 
                <img src="/llbj-logo.svg" alt="Logo Colégio" id="logo-escola"/>
                <h1>Um futuro melhor para seus filhos!</h1>
                <p id="texto-escola">Nossa escola é um espaço onde o conhecimento, os valores e o respeito caminham juntos na construção do futuro.</p>
                <div className="container">
                    <img src="/criancas.png" alt="Crianças com livro" id="criancas"/>
                    <div className="initial-login">
                        <img src="/coruja.svg" alt="Coruja LLBJ" id="coruja-foto"/>
                        <ButtonRedirect title='Comece aqui!' redirect='/login'></ButtonRedirect>
                        <p>Encontre experiências reais e vá além dos livros!</p>
                    </div>
                    <img src="/adolescente.png" alt="Adolescente com livro" id="adolescente"/> 
                </div>
            </div>
            <InformationCard></InformationCard>
        </div>
    );
}