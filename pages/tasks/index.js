import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import TaskTable from '@/components/task/TaskTable';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { tasksAPIs } from '@/utility/api/taskApi';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const TaskListPage = () => {
    const router = useRouter();
    const { userDetails } = useSelector((state) => state.usersSlice);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [data, setData] = useState([]);
    const { toast } = useToast();
    const [date, setDate] = useState(null)
    const [filters, setFilters] = useState({
        dueDate: null,
        priority: null,
        status: null,
    });

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
        },
        {
            header: "Action",
            accessorKey: "action",
        },
    ]


    useEffect(() => {
        getTasksList()
    }, [filters]);


    const getTasksList = async () => {
        setLoading(true);

        try {
            const response = await tasksAPIs.getAllTask(filters)
            if (response) {
                // console.log('response ==>', response);
                setData(response?.reverse())
                setLoading(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            if (error?.response?.data == "Not found") {
                setData([])
                setLoading(false);
                return
            }

            toast({
                variant: "error",
                title: 'Something went wrong',
            })
            setLoading(false);
        }
    }


    const handleDelete = async () => {
        setDeleteLoading(true);

        try {
            const response = await tasksAPIs.deleteTask(selectedData?.id)
            if (response) {
                toast({
                    variant: "success",
                    title: 'Successfully deleted',
                })
                getTasksList()
                setOpenAlert(false);
                setDeleteLoading(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: 'Task delete failed',
            })
            setDeleteLoading(false);
        }
    }



    return (
        <Layout>
            <Container>
                <PageTitle title="Tasks" />

                <div className='flex items-end justify-end mb-5 gap-3'>
                    <Button
                        variants="primary"
                        className="w-fit"
                        onClick={() => router.push('/tasks/create')}
                    >
                        Create a Task
                    </Button>
                </div>

                <CardContent className="bg-white gap-0 mb-7">
                    {/* Filters */}
                    <div className='flex items-end gap-5 flex-wrap'>
                        {userDetails?.preferences?.showDateFilter &&
                            <div className="w-full sm:w-72">
                                <p className='text-md text-primary mb-1'>Filter by date</p>

                                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full sm:w-72 pl-3 text-left font-normal justify-start",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                            {date ? (
                                                format(date, "dd-MM-yyyy")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            initialFocus
                                            selected={date}
                                            required={true}
                                            onSelect={(date) => {
                                                setDate(date)
                                                setOpenDatePicker(false)
                                                setFilters({ ...filters, dueDate: format(date, "yyyy-MM-dd") })
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        }

                        {userDetails?.preferences?.showPriorityFilter &&
                            <div className="w-full sm:w-72">
                                <p className='text-md text-primary mb-1'>Filter by priority</p>

                                <Select
                                    value={filters.priority}
                                    onValueChange={(value) => {
                                        setFilters({ ...filters, priority: value })
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>None</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        }

                        {userDetails?.preferences?.showStatusFilter &&
                            <div className="w-full sm:w-72">
                                <p className='text-md text-primary mb-1'>Filter by status</p>

                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => {
                                        setFilters({ ...filters, status: value })
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-96' >
                                        <SelectItem value={null}>None</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        }
                    </div>

                    {(userDetails?.preferences?.showDateFilter || userDetails?.preferences?.showPriorityFilter || userDetails?.preferences?.showStatusFilter) &&
                        <div className='flex justify-end mt-2 mb-5'>
                            <p
                                className='cursor-pointer underline text-tertiary'
                                onClick={() => {
                                    setDate(null)
                                    setFilters({
                                        dueDate: null,
                                        priority: null,
                                        status: null,
                                    })
                                }}
                            >
                                Clear filter
                            </p>
                        </div>
                    }

                    {/* Tasks list Table */}
                    <TaskTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        setOpenAlert={setOpenAlert}
                        setSelectedData={setSelectedData}
                    />

                    {/* Alert for Delete */}
                    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will delete the task
                                    and remove from the list.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button
                                    onClick={() => handleDelete()}
                                    loading={deleteLoading}
                                    disabled={deleteLoading}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Container>
        </Layout >
    );
};

export default TaskListPage;
