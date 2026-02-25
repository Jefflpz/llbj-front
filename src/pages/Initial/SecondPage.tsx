import "./SecondPage.css";

export default function SecondPage() {
    return (
        <div className="second-page" id="funcionalidades">
            <div className="head-title">
                <p className="title">Funcionalidades de Impacto</p>
                <p className="subtitle">Inovação constante para que sua gestão escolar nunca pare de evoluir.</p>
            </div>
            <div className="functions">
                <img src="background.svg" alt="Background" className="background"/>
                <div className="controle-total">
                    <img src="controle-total.svg" alt="Ícone controle total" className="icon-function-controle"/>
                    <p className="card-title">Controle Total</p>
                    <p className="card-content">Gestão completa de usuários com níveis de acesso personalizados para cada função.</p>
                </div>
                <div className="lancamento-agil">
                    <img src="lancamento-agil.svg" alt="Ícone lancamento agil" className="icon-function-lancamento"/>
                    <p className="card-title">Lançamento Ágil</p>
                    <p className="card-content-lancamento">Notas e frequências registradas em segundos através de uma interface ultra-rápida.</p>
                </div>
                <div className="boletim-inteligente">
                    <img src="boletim.svg" alt="Ícone boletim inteligente" className="icon-function-boletim"/>
                    <p className="card-title">Boletim Inteligente</p>
                    <p className="card-content-boletim">Visualização clara do desempenho com insights automáticos por disciplina.</p>
                </div>
            </div>
            <div className="functions">
                <div className="controle-total">
                    <img src="feedback.svg" alt="Ícone feedback direto" className="icon-function-boletim"/>
                    <p className="card-title" id="feedback">Feedback Direto</p>
                    <p className="card-content">Canal de comunicação seguro para aproximar escola e família em tempo real.</p>
                </div>
                <div className="controle-total" id="seguranca">
                    <img src="seguranca.svg" alt="Ícone seguranca maxima" className="icon-function-controle"/>
                    <p className="card-title" >Segurança Máxima</p>
                    <p className="card-content">Dados protegidos com o que há de mais moderno em criptografia e normas LGPD.</p>
                </div>
                <div className="controle-total" id="sincronia">
                    <img src="sincronia.svg" alt="Ícone sincronia total" className="icon-function-lancamento"/>
                    <p className="card-title">Sincronia Total</p>
                    <p className="card-content">Sua escola na palma da mão, acessível de qualquer dispositivo e em qualquer lugar.</p>
                </div>
            </div>
        </div>
    );
}