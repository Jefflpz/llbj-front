import { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import './QuizResolverModal.css';

interface QuizResolverModalProps {
    isOpen: boolean;
    onClose: () => void;
    quiz: any;
}

export function QuizResolverModal({ isOpen, onClose, quiz }: QuizResolverModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setAnswers({});
            setFinished(false);
        }
    }, [isOpen]);

    if (!isOpen || !quiz) return null;

    const questions = quiz.questions || [];

    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setFinished(true);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="resolver-modal-content">
                <div className="resolver-modal-header">
                    <div className="resolver-header-info">
                        <div className="resolver-icon-wrap">
                            <Target size={28} />
                        </div>
                        <div>
                            <h2 className="resolver-title">{quiz.title}</h2>
                            <p className="resolver-desc">{quiz.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} />
                    </button>
                </div>

                <div className="resolver-modal-body">
                    {finished ? (
                        <div className="resolver-success-screen">
                            <CheckCircle2 size={80} className="resolver-success-icon" />
                            <h3 className="resolver-success-title">Avaliação Concluída!</h3>
                            <p className="resolver-success-text">Suas respostas foram enviadas com sucesso e o professor já tem acesso ao seu boletim de notas.</p>
                            <button onClick={onClose} className="btn-resolver-finish">
                                Voltar para Disciplinas
                            </button>
                        </div>
                    ) : questions.length > 0 ? (
                        <div>
                            <div className="resolver-progress-wrapper">
                                <span>Questão {currentStep + 1} de {questions.length}</span>
                                <span>Valor: {quiz.score} pontos</span>
                            </div>
                            
                            <div>
                                <h3 className="resolver-question-title">
                                    {questions[currentStep].title || questions[currentStep].text}
                                </h3>
                                
                                <div className="resolver-options-list">
                                    {(questions[currentStep].options || []).map((opt: any) => {
                                        const isSelected = answers[questions[currentStep].id] === opt.id;
                                        return (
                                            <div 
                                                key={opt.id}
                                                onClick={() => handleSelectOption(questions[currentStep].id, opt.id)}
                                                className={`resolver-option-item ${isSelected ? 'selected' : ''}`}
                                            >
                                                <div className="resolver-radio-circle">
                                                    <div className="resolver-radio-dot" />
                                                </div>
                                                <span className="resolver-option-text">
                                                    {opt.text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="resolver-controls">
                                <button 
                                    disabled={currentStep === 0}
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="btn-resolver-nav btn-resolver-back"
                                >
                                    <ChevronLeft size={18} /> Anterior
                                </button>
                                
                                <button 
                                    disabled={!answers[questions[currentStep].id]}
                                    onClick={handleNext}
                                    className="btn-resolver-nav btn-resolver-next"
                                >
                                    {currentStep < questions.length - 1 ? (
                                        <>Próxima <ChevronRight size={18} /></>
                                    ) : (
                                        <>Finalizar <CheckCircle2 size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', fontSize: '1.1rem' }}>
                            Nenhuma questão cadastrada para este quiz. Tente novamente mais tarde.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
