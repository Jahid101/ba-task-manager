import CardContent from "@/components/customUI/CardContent";
import PageTitle from "@/components/customUI/PageTitle";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const TaskTable = dynamic(() => import('@/components/task/TaskTable'), {
  loading: () => <Spinner size="sm" className='mt-1' />,
  ssr: false,
});

const ListOfTasks = ({ date, data }) => {

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      align: 'left'
    },
    {
      header: "Created by",
      accessorKey: "createdBy.name",
    },
    {
      header: "Created date",
      accessorKey: "createdAt",
    },
    {
      header: "Due date",
      accessorKey: "dueDate",
    },
    {
      header: "Priority",
      accessorKey: "priority",
    },
    {
      header: "Status",
      accessorKey: "status",
    }
  ]


  return (
    <CardContent className="bg-white shadow-lg mb-7">
      <PageTitle title="List of tasks" className="text-xl mt-5 md:mt-0 mb-0" />

      {/* Task list Table */}
      <TaskTable
        columns={columns}
        data={data}
      />

      <div>
        <Link className="text-primary text-sm underline float-right" href="/tasks">
          View all tasks
        </Link>
      </div>
    </CardContent>
  );
};

export default ListOfTasks;
