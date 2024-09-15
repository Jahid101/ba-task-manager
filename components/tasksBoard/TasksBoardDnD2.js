import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"; // Shadcn's toast
import { Container } from "./Container"; // Each column is represented by a Container
import { Item } from "./sortable_item";

export default function TasksBoardDnD({ data }) {
  const { toast } = useToast();
  
  const [items, setItems] = useState({
    pending: [],
    inProgress: [],
    complete: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    setItems({
      pending: [],
      inProgress: [],
      complete: [],
    });
  }, [data]);

  const findContainer = (id) => {
    for (const [key, value] of Object.entries(items)) {
      if (value.some(item => item.id === id)) return key;
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const containerId = findContainer(active.id);
    setActiveId(active.id);
    setActiveItem(items[containerId].find(item => item.id === active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer !== overContainer) {
      setItems(prev => {
        const activeItems = prev[activeContainer].filter(item => item.id !== active.id);
        const overItems = [...prev[overContainer], activeItem];

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);
      const overIndex = items[overContainer].findIndex(item => item.id === over.id);

      if (activeIndex !== overIndex) {
        setItems(prev => ({
          ...prev,
          [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
    setActiveItem(null);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.pending}>
          <Container id="pending" title="Pending" items={items.pending} />
        </SortableContext>
        <SortableContext items={items.inProgress}>
          <Container id="inProgress" title="In Progress" items={items.inProgress} />
        </SortableContext>
        <SortableContext items={items.complete}>
          <Container id="complete" title="Complete" items={items.complete} />
        </SortableContext>

        <DragOverlay>
          {activeId ? <Item id={activeId} item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
