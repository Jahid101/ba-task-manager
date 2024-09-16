import { useToast } from "@/components/ui/use-toast";
import { tasksAPIs } from "@/utility/api/taskApi";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "../ui/spinner";
import Container from "./Container";
import { Item } from "./sortable_item";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
  overflowX: "auto",
};


export default function TasksBoardDnD({ data, loading, setLoading }) {
  const { userDetails } = useSelector((state) => state.usersSlice);
  const { toast } = useToast();
  const [rng, setRng] = useState(null)
  const [prevContainer, setPrevContainer] = useState('')
  const [updatedStatus, setUpdatedStatus] = useState(null)
  const [items, setItems] = useState({
    pending: [],
    inProgress: [],
    completed: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );


  useEffect(() => {
    if (rng) {
      handleUpdateStatusBoard()
    }
  }, [rng]);

  useEffect(() => {
    setItems({
      pending: data?.pending || [],
      inProgress: data?.inProgress || [],
      completed: data?.completed || [],
    });
  }, [data]);



  const handleUpdateStatusBoard = async () => {
    const payload = {
      ...activeItem,
      status: updatedStatus
    }

    delete payload?.id;
    delete payload?.createdAt;
    delete payload?.createdBy;

    payload.updatedBy = {
      name: userDetails?.name,
      date: new Date(),
    }

    try {
      const response = await tasksAPIs.updateTask(payload, activeItem?.id)

      if (response) {
      } else {
        location.reload();
        toast({
          variant: "error",
          title: "Task update failed",
        })
      }
    } catch (error) {
      console.log("error ==>", error);
      location.reload();
      toast({
        variant: "error",
        title: "Task update failed",
      })
    }
  };



  return (
    <div style={wrapperStyle}>

      {loading &&
        <div className='min-h-56 flex justify-center items-center'>
          <Spinner size='lg' />
        </div>
      }

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Container id="pending" items={items?.pending} />
        <Container id="inProgress" items={items?.inProgress} />
        <Container id="completed" items={items?.completed} />
        <DragOverlay>
          {
            activeId ?
              <Item id={activeId} item={activeItem} />
              :
              null
          }
        </DragOverlay>
      </DndContext>
    </div>
  );

  
  function findContainer(id) {
    if (id in items) {
      return id;
    }

    for (const [key, value] of Object.entries(items)) {
      if (value.some(item => item.id === id)) {
        return key;
      }
    }
    return null;
  };

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
    setPrevContainer(active.data.current.sortable.containerId)
    const activeItem = items[active.data.current.sortable.containerId].find(item => item.id == id)
    setActiveItem(activeItem)
  };

  function handleDragOver(event, hasToken = null) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems(prev => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex(item => item.id === id);
      const overIndex = overItems.findIndex(item => item.id === overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const updatedActiveItems = [
        ...prev[activeContainer].filter(item => item.id !== id)
      ];
      const updatedOverItems = [
        ...prev[overContainer].slice(0, newIndex),
        activeItems[activeIndex],
        ...prev[overContainer].slice(newIndex)
      ];

      return {
        ...prev,
        [activeContainer]: updatedActiveItems,
        [overContainer]: updatedOverItems
      };
    });
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);


    if ((overContainer != prevContainer) || (id != overId)) {
      setPrevContainer(overContainer)

      if (overContainer != prevContainer) {
        setRng(Math.random())

        // console.log('Task moved between columns', {
        //   fromContainer: activeContainer,
        //   toContainer: overContainer,
        // });
        if (overContainer == 'pending') {
          setUpdatedStatus('Pending')
        }
        if (overContainer == 'inProgress') {
          setUpdatedStatus('In Progress')
        }
        if (overContainer == 'completed') {
          setUpdatedStatus('Completed')
        }
        return;
      }
      else {
        if (id != overId) {
          // setRng(Math.random())
          // Vertically dnd stops
          return;
        }
      }
    }


    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);
    const overIndex = items[overContainer].findIndex(item => item.id === overId);

    if (activeIndex !== overIndex) {
      setItems(items => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
    setActiveItem(null);
  };

}
