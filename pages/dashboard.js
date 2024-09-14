import CardContent from "@/components/customUI/CardContent";
import Container from "@/components/customUI/Container";
import PageTitle from "@/components/customUI/PageTitle";
import ListOfTasks from "@/components/dashboard/ListOfTasks";
import MiniCard from "@/components/dashboard/MiniCard";
import Layout from "@/components/layout/Layout";
import CustomLoader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { tasksAPIs } from "@/utility/api/taskApi";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GrInProgress } from "react-icons/gr";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { useDispatch } from "react-redux";


const Dashboard = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [cardDataInfo, setCardDataInfo] = useState(null);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        dueDate: format(new Date(), "yyyy-MM-dd"),
        priority: null,
        status: null,
    });

    var cardData = [
        {
            id: 1,
            label: "Pending",
            amount: 0,
            icon: <MdOutlinePendingActions />,
        },
        {
            id: 2,
            label: "In Progress",
            amount: 0,
            icon: <GrInProgress />,
        },
        {
            id: 3,
            label: "Completed",
            amount: 0,
            icon: <IoIosCheckboxOutline />,
        },
    ];


    useEffect(() => {
        getDashboardStats();
    }, [filters]);


    const getDashboardStats = async () => {
        setLoading(true);

        try {
            const response = await tasksAPIs.getAllTask(filters)
            if (response) {
                // console.log('response ==>', response);

                let copyOfCardData = [...cardData];

                let pendingCount = response.filter(item => item.status == "Pending")
                let inProgressCount = response.filter(item => item.status == "In Progress")
                let completedCount = response.filter(item => item.status == "Completed")

                copyOfCardData[0].amount = pendingCount?.length || 0;
                copyOfCardData[1].amount = inProgressCount?.length || 0;
                copyOfCardData[2].amount = completedCount?.length || 0;

                let taskList = [...response];
                taskList?.reverse()

                if (response?.length > 10) {
                    taskList = response.slice(0, 10)
                    setData(taskList)
                } else {
                    setData(taskList)
                }

                setCardDataInfo(copyOfCardData)
                setLoading(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            if (error?.response?.data == "Not found") {
                setCardDataInfo(cardData)
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



    return (
        <>
            <Layout>
                <Container>
                    {pageLoad && <CustomLoader />}

                    {/* Page content */}
                    {!pageLoad &&
                        <>
                            <PageTitle title="Dashboard" className="font-normal" />

                            <div className='flex flex-col sm:flex-row items-end sm:justify-between mb-5 gap-3'>
                                <div>
                                    <p className='mb-1'>Filter by due date</p>

                                    <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                // disabled={!permissions?.dashboardView}
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
                                                // disabled={!permissions?.dashboardView}
                                                onSelect={(date) => {
                                                    setDate(date)
                                                    setOpenDatePicker(false)
                                                    setFilters({ ...filters, dueDate: format(date, "yyyy-MM-dd") })
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>


                                <Button
                                    variants="primary"
                                    className="w-fit"
                                    onClick={() => router.push('/tasks/create')}
                                >
                                    Create task
                                </Button>
                            </div>


                            <CardContent className="gap-5 mb-10 p-3 md:p-5">
                                {/* loader for MiniCard */}
                                {loading &&
                                    <div className='min-h-48 flex justify-center items-center'>
                                        <Spinner size='lg' />
                                    </div>
                                }
                                {/* Dashboard statistics */}
                                {!loading && <MiniCard cardData={cardDataInfo} />}

                                {/* Dashboard tasks list */}
                                {!loading && <ListOfTasks date={date} data={data} />}

                            </CardContent>


                        </>
                    }
                </Container>
            </Layout>
        </>
    );
};

export default Dashboard;
