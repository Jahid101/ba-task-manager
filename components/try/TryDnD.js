import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const initialData = [
    {
        createdAt: "2024-09-14T17:07:01.871Z",
        title: "j",
        description: "",
        dueDate: "2024-09-15",
        priority: "Low",
        status: "In Progress",
        createdBy: {
            name: "Jahid",
            date: "2024-09-14T19:27:16.063Z"
        },
        updatedBy: {
            name: "Admin",
            date: "2024-09-14T19:30:05.301Z"
        },
        id: "1"
    },
    {
        createdAt: "2024-09-14T13:32:48.866Z",
        title: "A",
        description: "",
        dueDate: "2024-09-16",
        priority: "Medium",
        status: "In Progress",
        createdBy: {
            name: "Admin",
            date: "2024-09-14T19:27:38.242Z"
        },
        updatedBy: {
            name: "DNA - Doura Noob Ailo",
            date: "2024-09-15T17:49:52.694Z"
        },
        id: "2"
    },
    {
        createdAt: "2024-09-15T04:01:04.129Z",
        title: "fgh",
        description: "fgh",
        dueDate: "2024-09-17",
        priority: "Medium",
        status: "Pending",
        createdBy: {
            name: "Admin",
            date: "2024-09-15T18:17:19.745Z"
        },
        updatedBy: {},
        id: "3"
    }
];

function SortableGrid() {
    const [items, setItems] = useState(initialData);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {items.map(item => (
                        <SortableItem key={item.id} id={item.id} data={item} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export default SortableGrid;
