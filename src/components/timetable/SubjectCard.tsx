import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Subject } from '../../models/timetable.model';

interface SubjectCardProps {
    id: string; // The specific dragged item id
    subject: Subject;
    isPaletteItem?: boolean;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, subject, isPaletteItem }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: {
            type: 'SUBJECT',
            subject,
            origin: isPaletteItem ? 'palette' : 'grid',
        },
    });

    // Dynamic colors based on id hash
    const colors = ['#e0e7ff', '#dcfce7', '#ffedd5', '#fce7f3', '#e0f2fe', '#f3f4f6'];
    const textColors = ['#4338ca', '#15803d', '#c2410c', '#be185d', '#0369a1', '#4b5563'];
    const borderColors = ['#6366f1', '#22c55e', '#f97316', '#ec4899', '#0ea5e9', '#6b7280'];

    const hashId = subject.id % colors.length;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`subject-card ${isDragging ? 'is-dragging' : ''}`}
            style={{
                backgroundColor: colors[hashId],
                borderLeftColor: borderColors[hashId],
            }}
        >
            <h3 className="subject-name" style={{ color: textColors[hashId] }}>
                {subject.name}
            </h3>
            <p className="subject-teacher">{subject.teacher?.name}</p>
            <div className="subject-room">
                <span>📍</span> Sala Padrão
            </div>
        </div>
    );
};
