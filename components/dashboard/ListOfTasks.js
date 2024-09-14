import CardContent from "@/components/customUI/CardContent";
import PageTitle from "@/components/customUI/PageTitle";
import TaskTable from "@/components/task/TaskTable";
import Link from "next/link";


const ListOfTasks = ({ date, data }) => {

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      align: 'left'
    },
    {
      header: "Created by",
      accessorKey: "createdBy",
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
