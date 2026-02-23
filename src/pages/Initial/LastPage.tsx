import './LastPage.css';

export default function LastPage() {
    return (
        <div className='last-page'> 
            <div className='head-title'>
                <p className='title'>Experiências Personalizadas</p>
                <p className='subtitle'>Ferramentas focadas nas necessidades reais de cada usuário.</p>
            </div>
            <div className='cards'>
                <div className='teacher-card'>
                    <div className='experience-card-title'>
                        <img src="teacher.svg" alt="Teacher Icon" className='card-icon' />
                        <p className='card-title'>Para Professores</p>
                    </div>
                    <div className='benefits'>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Diário de Classe Digital</h3>
                                <p className='benefit-exp'>Controle de frequência e conteúdos programáticos em segundos.</p>
                            </div>
                        </div>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Calculadora de Médias</h3>
                                <p className='benefit-exp'>Automação total no cálculo de médias bimestrais e anuais.</p>
                            </div>
                        </div>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Gestão de Turmas</h3>
                                <p className='benefit-exp'>Visualize o rendimento geral da turma com gráficos intuitivos.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='student-card'>
                    <div className='experience-card-title'>
                        <img src="parents.svg" alt="Parent Icon" className='card-icon-parent' />
                        <p className='card-title'>Para Alunos e Pais</p>
                    </div>
                    <div className='benefits'>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Boletim Online</h3>
                                <p className='benefit-exp'>Consulte notas e faltas assim que publicadas pelo docente.</p>
                            </div>
                        </div>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Agenda de Avaliações</h3>
                                <p className='benefit-exp'>Nunca perca uma prova ou entrega de trabalho importante.</p>
                            </div>
                        </div>
                        <div className='checks'>
                            <img src="check.svg" alt="check" />
                            <div className='benefit-texts'>
                                <h3 className='benefit-title'>Histórico Escolar</h3>
                                <p className='benefit-exp'>Acesso completo ao progresso acadêmico de anos anteriores.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}