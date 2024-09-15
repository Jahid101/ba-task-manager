import { useToast } from "@/components/ui/use-toast";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [openAlert, setOpenAlert] = useState(false);
  const [showAppointModal, setShowAppointModal] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [rng, setRng] = useState(null)
  const [prevContainer, setPrevContainer] = useState('')
  const [event, setEvent] = useState(null);
  const [prevItems, setPrevItems] = useState(null);
  const [prevItemsPerDnd, setPrevItemsPerDnd] = useState(null);
  const [items, setItems] = useState({
    pending: [],
    inProgress: [],
    complete: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [droppedItem, setDroppedItem] = useState(null);
  const [droppedContainer, setDroppedContainer] = useState(null);
  const [tokenRequired, setTokenRequired] = useState(false);


  useEffect(() => {
    if (rng) {
      handleUpdateStatusBoard()
    }
  }, []);

  useEffect(() => {
    setItems({
      pending: data?.pending || [],
      inProgress: data?.inProgress || [],
      complete: data?.complete || [],
    });
  }, []);



  const handleUpdateStatusBoard = () => {

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
        <Container id="pending" items={items.pending} />
        <Container id="inProgress" items={items.inProgress} />
        <Container id="complete" items={items.complete} />
        <DragOverlay>
          {
            activeId ?
              <div className="relative">
                <Item id={activeId} item={activeItem} />
                <div className="absolute top-2 right-3">
                  <HiOutlineDotsHorizontal className='text-primary font-bold ml-3' />
                </div>
              </div>
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
    setPrevItemsPerDnd(items)
    setActiveItem(activeItem)
    setDroppedItem(null)
    setDroppedContainer(null)
  };

  function handleDragOver(event, hasToken = null) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (overContainer == 'done' && !hasToken) {
      return;
    }

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

    // Old code ==>
    // if (overContainer === 'done' && activeContainer !== overContainer) {
    //   setOpenAlert(true);
    //   setEvent(event);
    //   return;
    // }
    // if (!activeContainer || !overContainer || activeContainer !== overContainer) {
    //   return;
    // }


    if ((overContainer != prevContainer) || (id != overId)) {
      // if (overContainer != prevContainer) {
      setPrevContainer(overContainer)
      // setRng(Math.random())

      if (overContainer != prevContainer) {
        // For on hold status ==>
        if (prevContainer == 'onHold' && activeItem?.type == 'to_be_determined' && !activeItem?.practitioner_id && (overContainer != prevContainer)) {
          setShowAppointModal(true)
          setDroppedItem(activeItem)
          setDroppedContainer(overContainer)
          if (overContainer == 'done') {
            setTokenRequired(true)
          }
          return;
        } else {
          // setRng(Math.random())

          // For done status ==>
          if (overContainer == 'done') {
            setOpenAlert(true);
            setEvent(event);
            return;
          } else {
            setRng(Math.random())
            return;
          }
        }
      }
      else {
        if (id != overId) {
          setRng(Math.random())
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
