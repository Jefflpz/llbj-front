import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TimetableSlot, TimetableItem, Subject } from '../../models/timetable.model';
import { SubjectCard } from './SubjectCard';

interface SlotCellProps {
    slot: TimetableSlot;
    item?: TimetableItem;
    subject?: Subject;
    onRemoveItem?: (itemId: number) => void;
}

export const SlotCell: React.FC<SlotCellProps> = ({ slot, item, subject, onRemoveItem }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: slot.slot_key,
        data: {
            type: 'SLOT',
            slot,
            item,
        },
    });

    if (slot.is_break) {
        return (
            <div className="slot-break">
                <span>INTERVALO</span>
                <div className="slot-break-line"></div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            className={`slot-cell ${!item ? 'slot-empty' : ''} ${isOver ? 'is-over' : ''}`}
        >
            {item && subject ? (
                <SubjectCard
                    id={item.id ? `grid-${item.id}` : `grid-temp-${slot.slot_key}`}
                    subject={subject}
                    onRemove={onRemoveItem ? () => onRemoveItem(item.id!) : undefined}
                />
            ) : (
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>+</span>
            )}
        </div>
    );
};
