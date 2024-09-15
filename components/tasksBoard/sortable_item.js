import CardContent from "@/components/customUI/CardContent";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export function Item(props) {
  const { item } = props;


  return (
    <CardContent className={permissions?.statusBoardUpdate ? "bg-white p-3 cursor-grab" : "bg-white p-3 cursor-default"}>
      <p className="leading-none text-primary font-semibold text-md">{item?.title?.length > 10 ? item?.title?.substring(0, 10) + ' ...' : item?.title?.substring(0, 10)}</p>
      <p className="leading-none text-sm">Task ID: {item?.id}</p>
      <p className="leading-none text-sm capitalize">Created by: {item?.createdBy?.name}</p>
      <p className="leading-none text-sm capitalize">Created at:
        {item?.createdBy?.date ?
          new Date(item?.createdBy?.date).toLocaleDateString("en-IN") + ' - ' + new Date(data?.createdBy?.date).toLocaleTimeString()
          : "-"
        }</p>
      <p className="leading-none text-sm">Priority: {item?.priority}</p>
      <p className="leading-none text-sm capitalize">Updated by: {item?.updatedBy?.name}</p>
      <p className="leading-none text-sm capitalize">Updated at:
        {item?.updatedBy?.date ?
          new Date(item?.updatedBy?.date).toLocaleDateString("en-IN") + ' - ' + new Date(data?.updatedBy?.date).toLocaleTimeString()
          : "-"
        }</p>
    </CardContent>
  )
}

export default function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    marginTop: '10px',
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} item={props?.item} />
    </div>
  );
}
