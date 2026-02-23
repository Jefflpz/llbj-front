import React, { useState } from 'react';
import type { Subject, TimetableItem } from '../../models/timetable.model';
import { useDraggable } from '@dnd-kit/core';
import { Search, Info, GripVertical } from 'lucide-react';

interface SubjectPaletteProps {
    subjects: Subject[];
    timetableItems: TimetableItem[];
}

const PaletteDraggableItem: React.FC<{ subject: Subject; itemsAllocated: number }> = ({ subject, itemsAllocated }) => {
    const isComplete = !!(subject.weeklyTargetHours && itemsAllocated >= subject.weeklyTargetHours);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${subject.id}`,
        data: {
            type: 'SUBJECT',
            subject,
            origin: 'palette',
        },
        disabled: isComplete,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`palette-item ${isComplete ? 'is-complete' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="palette-item-left">
                <div className="palette-icon">
                    <Info size={16} />
                </div>
                <div className="palette-info">
                    <h4>{subject.name}</h4>
                    <p>
                        {isComplete ? (
                            'COMPLETO'
                        ) : (
                            `${itemsAllocated}/${subject.weeklyTargetHours}h alocadas`
                        )}
                    </p>
                </div>
            </div>
            <div className="palette-drag-handle">
                {!isComplete && <GripVertical size={20} />}
            </div>
        </div>
    );
};

export const SubjectPalette: React.FC<SubjectPaletteProps> = ({ subjects, timetableItems }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Group by category
    const categoriesMap = new Map<string, Subject[]>();

    subjects
        .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach((s) => {
            const cat = s.category || 'OUTROS';
            if (!categoriesMap.has(cat)) {
                categoriesMap.set(cat, []);
            }
            categoriesMap.get(cat)?.push(s);
        });

    return (
        <div className="palette-container">
            <div className="drag-overlay-area">
                <span>Arraste as disciplinas para as células</span>
                <span>vazias para alocar horários.</span>
            </div>
            <div className="palette-header">
                <div style={{ backgroundColor: '#e0e7ff', padding: '6px', borderRadius: '8px', color: '#4338ca' }}>
                    <Info size={20} />
                </div>
                Disciplinas Disponíveis
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Buscar matéria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="palette-list" style={{ flex: 1, overflowY: 'auto' }}>
                {Array.from(categoriesMap.entries()).map(([category, subs]) => (
                    <div key={category} className="palette-category">
                        <h5 className="category-title">{category}</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {subs.map((subject) => {
                                const allocated = timetableItems.filter(
                                    (i) => i.subject_id === subject.id
                                ).length;

                                return (
                                    <PaletteDraggableItem
                                        key={subject.id}
                                        subject={subject}
                                        itemsAllocated={allocated}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};
