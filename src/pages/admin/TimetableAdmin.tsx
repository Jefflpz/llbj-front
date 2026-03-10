import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { Save, Trash2, Loader2 } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { timetableService } from '../../services/timetable.service';
import type {
    SchoolClass,
    Subject,
    TimetableItem,
    TimetableSlot,
} from '../../models/timetable.model';

import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { SubjectPalette } from '../../components/timetable/SubjectPalette';
import { SubjectCard } from '../../components/timetable/SubjectCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import '../../styles/AdminTimetable.css';

export default function TimetableAdmin() {
    const [loading, setLoading] = useState(true);

    // Data State
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [slots, setSlots] = useState<TimetableSlot[]>([]);
    const [timetable, setTimetable] = useState<TimetableItem[]>([]);

    // Selection State
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('Manhã');

    // Drag State
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [activeOrigin, setActiveOrigin] = useState<'palette' | 'grid'>('palette');

    // Modal State
    const [pendingDrop, setPendingDrop] = useState<{
        newItem: TimetableItem;
        itemToRemoveId?: number;
    } | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            loadGridData(selectedClassId, selectedPeriod);
        }
    }, [selectedClassId, selectedPeriod]);

    const loadClasses = async () => {
        const data = await timetableService.getClasses();
        setClasses(data);
        if (data.length > 0) {
            setSelectedClassId(data[0].id);
        }
    };

    const loadGridData = async (classId: number, period: string) => {
        setLoading(true);
        try {
            const [_subjects, _slots, _items] = await Promise.all([
                timetableService.getSubjectsByClass(classId),
                timetableService.getSlots(period),
                timetableService.getTimetable(classId, period),
            ]);
            setSubjects(_subjects);
            setSlots(_slots);
            setTimetable(_items);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar os dados da grade.');
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const { subject, origin } = active.data.current as { subject: Subject; origin: 'palette' | 'grid' };
        setActiveSubject(subject);
        setActiveOrigin(origin);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveSubject(null);

        if (!over) return; // Dropped outside valid zones

        const sourceData = active.data.current as { subject: Subject; origin: 'palette' | 'grid'; item?: TimetableItem };
        const destData = over.data.current as { slot: TimetableSlot; item?: TimetableItem };

        if (!sourceData || !destData) return;

        const { subject, origin } = sourceData;
        const { slot, item: existingDestItem } = destData;

        // Reject drop onto a break
        if (slot.is_break) return;

        if (origin === 'palette') {
            const newItem: TimetableItem = {
                id: Date.now(),
                class_id: selectedClassId!,
                period: selectedPeriod,
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time,
                subject_id: subject.id,
                active: 1,
            };

            if (existingDestItem) {
                // Request replacement
                setPendingDrop({ newItem });
                setShowConfirmModal(true);
                return;
            }

            // Direct Insert
            setTimetable((prev) => [...prev, newItem]);

        } else if (origin === 'grid') {
            const draggedItemId = active.id.toString().replace('grid-', '');
            const itemToMove = timetable.find((i) => i.id?.toString() === draggedItemId);
            if (!itemToMove) return;

            const newItem = {
                ...itemToMove,
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time,
            };

            if (existingDestItem) {
                // Request replacement
                setPendingDrop({
                    newItem,
                    itemToRemoveId: itemToMove.id,
                });
                setShowConfirmModal(true);
                return;
            }

            // Direct Move
            setTimetable((prev) => [
                ...prev.filter((i) => i.id !== itemToMove.id),
                newItem,
            ]);
        }
    };

    const confirmDrop = () => {
        if (!pendingDrop) return;

        const { newItem, itemToRemoveId } = pendingDrop;

        setTimetable((prev) => {
            const filtered = prev.filter((i) => {
                const isOverridingDest =
                    i.day_of_week === newItem.day_of_week &&
                    i.start_time === newItem.start_time;
                const isOldOrigin = itemToRemoveId && i.id === itemToRemoveId;

                return !isOverridingDest && !isOldOrigin;
            });
            return [...filtered, newItem];
        });

        cancelDrop();
    };

    const cancelDrop = () => {
        setPendingDrop(null);
        setShowConfirmModal(false);
    };

    const handleSave = async () => {
        if (!selectedClassId) return;
        try {
            await timetableService.saveTimetable(selectedClassId, selectedPeriod, timetable);
            alert('Grade salva com sucesso!');
        } catch (err) {
            alert('Erro ao salvar grade.');
        }
    };

    const requestClear = () => {
        setShowClearModal(true);
    };

    const executeClear = async () => {
        setTimetable([]);
        if (selectedClassId) {
            await timetableService.clearTimetable(selectedClassId, selectedPeriod);
        }
        setShowClearModal(false);
    };

    const handleRemoveItem = (itemId: number) => {
        setTimetable((prev) => prev.filter((i) => i.id !== itemId));
    };

    // Removing unused handleExport

    const countAllocatedHours = () => {
        return timetable.length; // Assuming each item represents 1 hour (or 50min class)
    };

    const calculateTargetHours = () => {
        return subjects.reduce((acc, sub) => acc + (sub.weeklyTargetHours || 0), 0);
    };

    return (
        <div className="timetable-admin-page">
            <Sidebar />

            <main className="timetable-content">
                <header className="timetable-header">
                    <div className="timetable-title">
                        <Breadcrumbs items={[
                            { label: 'Início', path: '/' },
                            { label: 'Administração' },
                            { label: 'Grade Horária' }
                        ]} />
                        <h1><strong>Definição de Grade Horária</strong></h1>
                        <p>Distribua as disciplinas e gerencie o cronograma semanal.</p>
                    </div>
                    <div className="header-buttons">
                        <button className="btn-save" onClick={handleSave}>
                            <Save size={18} /> Salvar Grade
                        </button>
                    </div>
                </header>

                <section className="filters-row">
                    <div className="select-group">
                        <div className="select-field">
                            <label>Ano/Série</label>
                            <select
                                value={selectedClassId || ''}
                                onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            >
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="select-field">
                            <label>Período</label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                        </div>
                    </div>

                    <div className="timetable-status">
                        <span className="status-hours">
                            Carga Horária:{' '}
                            <strong>
                                {countAllocatedHours()} / {calculateTargetHours()}h
                            </strong>
                        </span>
                        <button className="btn-clear" onClick={requestClear}>
                            <Trash2 size={16} /> Limpar Tudo
                        </button>
                    </div>
                </section>

                {loading ? (
                    <div className="grid-loading-state">
                        <Loader2 className="spinner-icon" size={40} />
                        <p>Carregando grade horária...</p>
                    </div>
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="timetable-body">
                            <TimetableGrid
                                slots={slots}
                                items={timetable}
                                subjects={subjects}
                                onRemoveItem={handleRemoveItem}
                            />
                            <SubjectPalette
                                subjects={subjects}
                                timetableItems={timetable}
                            />
                        </div>

                        <DragOverlay dropAnimation={null}>
                            {activeSubject ? (
                                <div style={{ width: 140, height: 90, opacity: 0.8 }}>
                                    <SubjectCard
                                        id="overlay"
                                        subject={activeSubject}
                                        isPaletteItem={activeOrigin === 'palette'}
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}

                {/* Modals Internos da Página */}
                {showConfirmModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-content">
                            <h3>Substituir aula?</h3>
                            <p>Este horário já está preenchido por outra disciplina. Deseja sobrescrever a aula existente?</p>
                            <div className="custom-modal-actions">
                                <button className="btn-modal-cancel" onClick={cancelDrop}>Cancelar</button>
                                <button className="btn-modal-confirm" onClick={confirmDrop}>Sim, substituir</button>
                            </div>
                        </div>
                    </div>
                )}

                {showClearModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-content">
                            <h3>Limpar a Grade Inteira?</h3>
                            <p>Tem certeza que deseja remover TODAS as aulas desta visão? Esta ação é irreversível.</p>
                            <div className="custom-modal-actions">
                                <button className="btn-modal-cancel" onClick={() => setShowClearModal(false)}>Manter grade</button>
                                <button className="btn-modal-danger" onClick={executeClear}>Limpar grade</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
