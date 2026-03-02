import React, { useState, useEffect } from 'react';
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
    onSend: (type: '1' | '2' | '3', message: string, selectedIds: string[]) => void;
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

    // Determines if the "turma" group chip should be shown instead of individual chips.
    // It is shown when ALL students are selected.
    const isAllSelected = selectedStudentIds.length === studentsInClass.length && studentsInClass.length > 0;

    // Reset state when modal opens
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

        const validTypes = ['1', '2', '3'] as const;
        if (!validTypes.includes(observationType as any)) return;

        onSend(observationType as '1' | '2' | '3', observationText, selectedStudentIds);
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

                    {/* Recipients Section (Email style) */}
                    <div className="form-group recipients-group">
                        <label>Para:</label>
                        <div className="recipients-input-area">
                            {selectedStudentIds.length === 0 ? (
                                <span className="no-recipients">Nenhum aluno selecionado</span>
                            ) : isAllSelected ? (
                                <div className="recipient-chip turma-chip">
                                    <div className="chip-icon"><Users size={14} /></div>
                                    <span className="chip-label">Turma: {currentTurma.name}</span>
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
                            <option value="1">Tipo 1 - Comportamento</option>
                            <option value="2">Tipo 2 - Desempenho Acadêmico</option>
                            <option value="3">Tipo 3 - Atraso / Frequência</option>
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
