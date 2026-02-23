import '../styles/Initial.css';
import ButtonRedirect from '../components/Buttons/ButtonRedirect';
import InformationCard from '../components/information/InformationCard';

export default function Initial() {
  const text = {
    title: 'Um futuro melhor para seus filhos!',
    description:
      'Nossa escola é um espaço onde o conhecimento, os valores e o respeito caminham juntos na construção do futuro.',
  };

  return (
    <div className="initial-page">
      <div className="initial-card">
        <img src="/llbj-logo.svg" alt="Logo Colégio" className="logo-escola" />
        <h1>{text.title}</h1>
        <p className="texto-escola">{text.description}</p>
        <div className="container">
          <img
            src="/criancas.png"
            alt="Crianças com livro"
            className="criancas"
          />
          <div className="initial-login">
            <img src="/owl.svg" alt="Coruja LLBJ" className="coruja-foto" />
            <ButtonRedirect
              title="Comece aqui!"
              redirect="/login"
            ></ButtonRedirect>
            <p>Encontre experiências reais e vá além dos livros!</p>
          </div>
          <img
            src="/adolescente.png"
            alt="Adolescente com livro"
            className="adolescente"
          />
        </div>
      </div>
      <div className="info-card">
        <InformationCard></InformationCard>
        <img src="/Bag.svg" alt="Mochila" className="bag bag1" />
        <img src="/Study bag.svg" alt="Mochila 2" className="bag bag2" />
      </div>
    </div>
  );
}
