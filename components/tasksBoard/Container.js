import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import PageTitle from "@/components/customUI/PageTitle";
import { useRouter } from "next/router";
import { GrInProgress } from "react-icons/gr";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import SortableItem from "./sortable_item";


const containerStyle = {
  // background: "#b0d8ee82", //"#B0D8EE", //"#dadada",
  border: '1px solid #80808057',
  minHeight: "320px",
  maxHeight: "940px",
  overflowY: "auto",
  borderRadius: '8px',
  minWidth: '330px',
  padding: 10,
  margin: 10,
  flex: 1
};

export default function Container(props) {
  const { id, items } = props;
  const router = useRouter();

  const { setNodeRef } = useDroppable({
    id
  });


  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}
        className="bg-[#b0d8ee33]"
      >
        <PageTitle
          className={'text-xl font-semibold my-3'}
          title={
            id == 'pending' ?
              <div div className="flex items-center gap-4 px-1">
                <MdOutlinePendingActions />
                <span>Pending</span>
              </div>
              :
              id == 'inProgress' ?
                <div div className="flex items-center gap-4 px-1">
                  <GrInProgress className="w-5 h-5" />
                  <span>In Progress</span>
                </div>
                :
                id == 'completed' ?
                  <div div className="flex items-center gap-4 px-1">
                    <IoIosCheckboxOutline className="w-6 h-6" />
                    <span>Completed</span>
                  </div>
                  :
                  null
          }
        />

        {items && items?.length > 0 && items?.map((item, idx) => (
          <SortableItem key={item?.id} id={item?.id} item={item} />
        ))}
      </div>
    </SortableContext >
  );
}
