import React from 'react';
import type { Subject, TimetableItem, TimetableSlot } from '../../models/timetable.model';
import { SlotCell } from './SlotCell';

interface TimetableGridProps {
    slots: TimetableSlot[];
    items: TimetableItem[];
    subjects: Subject[];
    onRemoveItem?: (itemId: number) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ slots, items, subjects, onRemoveItem }) => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    // Identify unique timeslots combinations (row headers)
    const uniqueTimes = Array.from(
        new Map(
            slots.map((s) => [`${s.start_time}-${s.end_time}`, { start: s.start_time, end: s.end_time, isBreak: s.is_break }])
        ).values()
    ).sort((a, b) => a.start.localeCompare(b.start));

    return (
        <div className="timetable-grid-container">
            <div className="timetable-grid">
                {/* Header Row */}
                <div></div> {/* Corner */}
                {days.map((day) => (
                    <div key={day} className="grid-header">
                        {day}
                    </div>
                ))}

                {/* Rows loop based on Time */}
                {uniqueTimes.map((time) => {
                    if (time.isBreak) {
                        return (
                            <React.Fragment key={`${time.start}-break`}>
                                <div className="time-column">
                                    <div className="time-label">
                                        <span>{time.start}</span>
                                        <span>INTERVALO</span>
                                        <span>{time.end}</span>
                                    </div>
                                </div>
                                <div className="slot-break">
                                </div>
                            </React.Fragment>
                        );
                    }

                    return (
                        <React.Fragment key={time.start}>
                            <div className="time-column">
                                <div className="time-label">
                                    <span>{time.start}</span>
                                    <span>{time.end}</span>
                                </div>
                            </div>

                            {days.map((day) => {
                                const targetKey = `${day}-${time.start}`;
                                const slotdef = slots.find((s) => s.slot_key === targetKey);

                                if (!slotdef) {
                                    return <div key={targetKey} className="slot-empty" style={{ opacity: 0.2 }}></div>;
                                }

                                // Check if this slot has a timetable item mapped
                                const mappedItem = items.find(
                                    (i) => i.day_of_week === day && i.start_time === time.start
                                );

                                const subject = mappedItem && subjects
                                    ? subjects.find((sub) => sub.id === mappedItem.subject_id)
                                    : undefined;

                                return (
                                    <SlotCell
                                        key={slotdef.slot_key}
                                        slot={slotdef}
                                        item={mappedItem}
                                        subject={subject}
                                        onRemoveItem={onRemoveItem}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
