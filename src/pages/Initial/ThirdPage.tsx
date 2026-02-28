import './ThirdPage.css';
import Steps from '../../components/Steps/Steps';

export default function ThirdPage() {
    return (
        <div className="third-page">
            <p className="title">Como Funciona?</p>
            <div className="steps">
                <Steps number='01' title='Faça seu Login' step='Acesse com suas credenciais seguras em qualquer dispositivo.'></Steps>
                <Steps number='02' title='Acesse o Dashboard' step='Tenha uma visão panorâmica das suas turmas ou boletim.'></Steps>
                <Steps number='03' title='Gerencie e Visualize' step='Lance notas, envie comunicados ou consulte seu desempenho.'></Steps>
            </div>
        </div>
    )
}