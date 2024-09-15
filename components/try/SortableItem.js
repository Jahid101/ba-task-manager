import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, data }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h3>{data.title}</h3>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Priority:</strong> {data.priority}</p>
            <p><strong>Due Date:</strong> {data.dueDate}</p>
        </div>
    );
}
