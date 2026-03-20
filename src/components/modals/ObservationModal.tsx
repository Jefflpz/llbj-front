import { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import './ObservationModal.css';

interface Student {
    id: string;
    name: string;
    urlImage?: string;
}

interface Turma {
    id: number;
    name: string;
}

interface ObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTurma: Turma;
    studentsInClass: Student[];
    selectedStudentIds: string[];
    onRecipientChange: (newSelectedIds: string[]) => void;
    onSend: (type: 'TYPE_1' | 'TYPE_2' | 'TYPE_3', message: string, selectedIds: string[]) => void;
}

export function ObservationModal({
    isOpen,
    onClose,
    currentTurma,
    studentsInClass,
    selectedStudentIds,
    onRecipientChange,
    onSend
}: ObservationModalProps) {
    const [observationType, setObservationType] = useState('');
    const [observationText, setObservationText] = useState('');
    const [showError, setShowError] = useState(false);

    const isAllSelected = selectedStudentIds.length === studentsInClass.length && studentsInClass.length > 0;

    useEffect(() => {
        if (isOpen) {
            setObservationType('');
            setObservationText('');
            setShowError(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRemoveAll = () => {
        onRecipientChange([]);
    };

    const handleRemoveStudent = (studentId: string) => {
        onRecipientChange(selectedStudentIds.filter(id => id !== studentId));
    };

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!observationType || !observationText.trim() || selectedStudentIds.length === 0) {
            setShowError(true);
            return;
        }

        const validTypes = ['TYPE_1', 'TYPE_2', 'TYPE_3'] as const;
        if (!validTypes.includes(observationType as any)) return;

        onSend(observationType as 'TYPE_1' | 'TYPE_2' | 'TYPE_3', observationText, selectedStudentIds);
        handleClose();
    };

    return (
        <div className="observation-modal-overlay" onClick={handleClose}>
            <div className="observation-modal-content" onClick={e => e.stopPropagation()}>
                <div className="observation-modal-header">
                    <h2>Nova Observação</h2>
                    <button className="btn-close-modal" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="observation-form">

                    <div className="form-group recipients-group">
                        <label>Para:</label>
                        <div className="recipients-input-area">
                            {selectedStudentIds.length === 0 ? (
                                <span className="no-recipients">Nenhum aluno selecionado</span>
                            ) : isAllSelected ? (
                                <div className="recipient-chip turma-chip">
                                    <div className="chip-icon"><Users size={14} /></div>
                                    <span className="chip-label">Turma: {currentTurma?.name || 'Turma Inteira'}</span>
                                    <button type="button" className="btn-remove-chip" onClick={handleRemoveAll}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                studentsInClass
                                    .filter(s => selectedStudentIds.includes(s.id))
                                    .map(student => (
                                        <div key={student.id} className="recipient-chip student-chip">
                                            {student.urlImage && (
                                                <img src={student.urlImage} alt="" className="chip-avatar" />
                                            )}
                                            <span className="chip-label">{student.name}</span>
                                            <button type="button" className="btn-remove-chip" onClick={() => handleRemoveStudent(student.id)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observationType">Tipo de Observação</label>
                        <select
                            id="observationType"
                            value={observationType}
                            onChange={(e) => setObservationType(e.target.value)}
                            className={showError && !observationType ? 'input-error' : ''}
                        >
                            <option value="">Selecione o tipo...</option>
                            <option value="TYPE_1">Tipo 1 - Comportamento</option>
                            <option value="TYPE_2">Tipo 2 - Desempenho Acadêmico</option>
                            <option value="TYPE_3">Tipo 3 - Atraso / Frequência</option>
                        </select>
                    </div>

                    <div className="form-group flex-1">
                        <textarea
                            placeholder="Descreva a observação sobre o(s) aluno(s)..."
                            value={observationText}
                            onChange={(e) => setObservationText(e.target.value)}
                            className={showError && !observationText.trim() ? 'input-error' : ''}
                        ></textarea>
                    </div>

                    {showError && (
                        <div className="error-message">
                            Por favor, preencha todos os campos e selecione pelo menos um destinatário.
                        </div>
                    )}

                    <div className="observation-modal-footer">
                        <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
                        <button type="submit" className="btn-send">Enviar Observação</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
