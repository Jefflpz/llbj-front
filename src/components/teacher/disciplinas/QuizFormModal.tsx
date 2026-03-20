import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import type { Quiz } from '../../../hooks/useQuizzes';
import { useAuth } from '../../../auth/AuthContext';
import { useSubjects } from '../../../hooks/useSubjects';
import { useAgenda } from '../../../hooks/useAgenda';
import { timetableService } from '../../../services/timetable.service';
import './QuizFormModal.css';

export interface QuizQuestion {
    id?: string;
    title?: string;
    text?: string;
    options: {
        id?: string;
        text: string;
        isCorrect?: boolean;
        correct?: boolean;
    }[];
}

interface QuizFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: any) => void;
    quizToEdit?: Quiz | null;
    preSelectedSubjectId?: number | null;
}

export function QuizFormModal({ isOpen, onClose, onSave, quizToEdit, preSelectedSubjectId }: QuizFormModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [score, setScore] = useState<number>(10);
    const [releaseDate, setReleaseDate] = useState('');
    const [deadline, setDeadline] = useState('');

    const [subjectId, setSubjectId] = useState<number | ''>('');
    const [weekId, setWeekId] = useState<number | ''>('');
    const [materialId, setMaterialId] = useState<number | ''>('');
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [availableDays, setAvailableDays] = useState<string[]>([]);

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);

    const { data: subjects = [] } = useSubjects(undefined, user?.registration);
    const { data: agendaData } = useAgenda(Number(subjectId) || 0);

    const availableAgendas = subjectId ? (agendaData?.agendas || []) : [];
    const availableMaterials = subjectId ? (agendaData?.materials || []) : [];

    useEffect(() => {
        if (subjectId) {
            const selectedSubject = (subjects || []).find(s => s.id === subjectId);
            if (selectedSubject && selectedSubject.classId) {
                timetableService.getTimetable(selectedSubject.classId, 'Manhã')
                    .then(items => {
                        const subjectItems = items.filter(item => item.subject_id === Number(subjectId));
                        const uniqueDays = Array.from(new Set(subjectItems.map(item => item.day_of_week)));
                        setAvailableDays(uniqueDays);
                    });
            } else {
                setAvailableDays([]);
            }
        } else {
            setAvailableDays([]);
        }
    }, [subjectId, subjects]);

    useEffect(() => {
        if (quizToEdit) {
            setTitle(quizToEdit.title);
            setDescription(quizToEdit.description || '');
            setScore(quizToEdit.score);
            setReleaseDate(quizToEdit.releaseDate || '');
            setDeadline(quizToEdit.deadline || '');
            setSubjectId(quizToEdit.subjectId || '');
            setWeekId(quizToEdit.weekId || '');
            setMaterialId(quizToEdit.materialId || '');

            setQuestions(quizToEdit.questions.map((q: any) => ({
                text: q.text || q.title || '',
                options: (q.options || []).map((o: any) => ({
                    text: o.text,
                    isCorrect: o.correct || o.isCorrect || false
                }))
            })));
        } else {
            resetForm();
            if (preSelectedSubjectId) {
                setSubjectId(preSelectedSubjectId);
            }
        }
    }, [quizToEdit, isOpen, preSelectedSubjectId]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setScore(10);
        setDeadline('');
        setSubjectId('');
        setWeekId('');
        setMaterialId('');
        setSelectedDay('');
        setQuestions([]);
    };

    if (!isOpen) return null;

    const handleAddQuestion = () => {
        const newQuestion: QuizQuestion = {
            text: '',
            options: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false }
            ]
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleQuestionChange = (qIndex: number, newTitle: string) => {
        const updated = [...questions];
        updated[qIndex].text = newTitle;
        setQuestions(updated);
    };

    const handleRemoveQuestion = (qIndex: number) => {
        const updated = [...questions];
        updated.splice(qIndex, 1);
        setQuestions(updated);
    };

    const handleAddOption = (qIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.push({
            text: '',
            isCorrect: false
        });
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, newText: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].text = newText;
        setQuestions(updated);
    };

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.splice(oIndex, 1);
        setQuestions(updated);
    };

    const handleMarkCorrect = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.forEach(opt => opt.isCorrect = false);
        updated[qIndex].options[oIndex].isCorrect = true;
        setQuestions(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || questions.length === 0) {
            alert('Por favor, preencha o título e adicione pelo menos uma questão.');
            return;
        }

        const quizData = {
            id: quizToEdit ? quizToEdit.id : undefined,
            title,
            description,
            score,
            releaseDate: releaseDate || new Date().toISOString(),
            deadline: deadline || new Date().toISOString(),
            subjectId: subjectId === '' ? null : Number(subjectId),
            weekId: weekId === '' ? null : Number(weekId),
            materialId: materialId === '' ? null : Number(materialId),
            questions: questions.map((q: any) => ({
                title: q.text || q.title,
                options: q.options.map((o: any) => ({
                    text: o.text,
                    isCorrect: !!o.isCorrect || !!o.correct
                }))
            })),
        };

        onSave(quizData);
        onClose();
        resetForm();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content quiz-modal">
                <div className="modal-header">
                    <h2>{quizToEdit ? 'Editar Quiz' : 'Criar Novo Quiz'}</h2>
                    <button type="button" className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="quiz-form-body">
                    <div className="form-row form-row-2-1">
                        <div className="form-group">
                            <label>Título do Quiz *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Ex: Avaliação Diagnóstica - Células"
                            />
                        </div>
                        <div className="form-group">
                            <label>Pontuação *</label>
                            <input
                                type="number"
                                value={score}
                                onChange={e => setScore(Number(e.target.value))}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descrição Opcional</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Instruções e descrições do quiz..."
                            rows={2}
                        />
                    </div>

                    <div className="form-row form-row-2">
                        <div className="form-group">
                            <label>Turma / Disciplina Alvo</label>
                            <select
                                value={subjectId}
                                onChange={e => {
                                    setSubjectId(e.target.value === '' ? '' : Number(e.target.value));
                                    setSelectedDay('');
                                }}
                                disabled={!!preSelectedSubjectId}
                            >
                                <option value="">-- Selecione a disciplina --</option>
                                {(subjects || []).map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dia da Aplicação (Agenda Mapeada)</label>
                            <select
                                value={selectedDay}
                                onChange={e => setSelectedDay(e.target.value)}
                                disabled={!subjectId || availableDays.length === 0}
                            >
                                <option value="">{availableDays.length === 0 ? "-- Nenhum dia na grade --" : "-- Selecione o dia da aula --"}</option>
                                {availableDays.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row form-row-2">
                        <div className="form-group">
                            <label>Vincular à Semana Base</label>
                            <select value={weekId} onChange={e => setWeekId(e.target.value === '' ? '' : Number(e.target.value))} disabled={!subjectId}>
                                <option value="">-- Nenhuma Semana --</option>
                                {availableAgendas.map(w => (
                                    <option key={w.id} value={w.id}>{w.weekName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Material de Apoio (Aula)</label>
                            <select value={materialId} onChange={e => setMaterialId(e.target.value === '' ? '' : Number(e.target.value))} disabled={!subjectId}>
                                <option value="">-- Nenhum --</option>
                                {availableMaterials
                                    .filter(m => weekId === '' || m.weekId === Number(weekId))
                                    .map(m => (
                                        <option key={m.id} value={m.id}>{m.title}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row form-row-2">
                        <div className="form-group">
                            <label>Data de Liberação</label>
                            <input
                                type="datetime-local"
                                value={releaseDate}
                                onChange={e => setReleaseDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Prazo de Entrega (Deadline)</label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <hr className="quiz-divider" />

                    <div className="questions-header">
                        <h3>Gestão de Questões</h3>
                        <button type="button" className="btn-add-question" onClick={handleAddQuestion}>
                            <Plus size={16} /> Adicionar Questão
                        </button>
                    </div>

                    <div className="questions-list">
                        {questions.length === 0 && (
                            <p className="no-questions-text">Nenhuma questão adicionada ainda. Clique no botão acima.</p>
                        )}
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="question-card">
                                <div className="question-card-header">
                                    <span className="question-number">Questão {qIndex + 1}</span>
                                    <button type="button" className="btn-remove-question" onClick={() => handleRemoveQuestion(qIndex)} title="Remover Questão">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={q.text}
                                        onChange={e => handleQuestionChange(qIndex, e.target.value)}
                                        placeholder="Digite o enunciado da questão..."
                                        required
                                        className="input-question-title"
                                    />
                                </div>

                                <div className="options-list">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className={`option-row ${opt.isCorrect ? 'option-correct' : ''}`}>
                                            <button
                                                type="button"
                                                className="btn-mark-correct"
                                                onClick={() => handleMarkCorrect(qIndex, oIndex)}
                                                title={opt.isCorrect ? "Resposta Correta" : "Marcar como correta"}
                                            >
                                                {opt.isCorrect ? <CheckCircle2 size={20} className="icon-correct" /> : <Circle size={20} className="icon-neutral" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={opt.text}
                                                onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                placeholder={`Opção ${oIndex + 1}`}
                                                required
                                            />
                                            {q.options.length > 2 && (
                                                <button type="button" className="btn-remove-option" onClick={() => handleRemoveOption(qIndex, oIndex)}>
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-option" onClick={() => handleAddOption(qIndex)}>
                                        <Plus size={14} /> Adicionar Alternativa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                            {quizToEdit ? 'Salvar Alterações' : 'Criar Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
