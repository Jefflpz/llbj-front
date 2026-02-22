import './InformationCard.css';
import InformationBlock from './InformationBlock';
export default function InformationCard() {
  return (
    <div className="information-card">
      <InformationBlock
        image="/escola-icone.svg"
        desc="Ícone escola"
        num="+7,5 mil"
        text="alunos prontos para novas experiências"
      ></InformationBlock>
      <InformationBlock
        image="/livro-icone.svg"
        desc="Ícone livro"
        num="#10"
        text="melhor escola de São Paulo"
      ></InformationBlock>
      <InformationBlock
        image="/trofeu-icone.svg"
        desc="Ícone trofeu"
        num="+50"
        text="medalhas em olimpíadas científicas"
      ></InformationBlock>
    </div>
  );
}
