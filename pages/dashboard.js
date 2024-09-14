import CardContent from "@/components/customUI/CardContent";
import Container from "@/components/customUI/Container";
import PageTitle from "@/components/customUI/PageTitle";
import MiniCard from "@/components/dashboard/MiniCard";
import Layout from "@/components/layout/Layout";
import CustomLoader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import { TbUserSquare } from "react-icons/tb";
import { useDispatch } from "react-redux";


const Dashboard = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [createAppointmentModal, setCreateAppointmentModal] = useState(false);
    const [cardDataInfo, setCardDataInfo] = useState(null);
    const [filters, setFilters] = useState({
        page: 0,
        per_page: 10,
        search: "",
        date: format(new Date(), "yyyy-MM-dd"),
    });

    var cardData = [
        {
            id: 1,
            label: "Pending",
            amount: 0,
            icon: <TbUserSquare />,
        },
        {
            id: 2,
            label: "In Progress",
            amount: 0,
            icon: <IoTimeOutline />,
        },
        {
            id: 3,
            label: "Completed",
            amount: 0,
            icon: <IoIosCheckboxOutline />,
        },
    ];


    useEffect(() => {
        //   getDashboardStats();
    }, [filters]);


    const getDashboardStats = () => {
        setLoading(true);
        dispatch(
            dashboardDispatcher.getDashboardStats(filters, userToken, {
                success: (response) => {
                    const { data } = response;
                    const copyOfCardData = [...cardData]

                    copyOfCardData[0].amount = data?.new_patients_count || 0;
                    copyOfCardData[1].amount = data?.in_processing_count || 0;
                    copyOfCardData[2].amount = data?.waiting_count || 0;
                    copyOfCardData[3].amount = data?.under_treatment_count || 0;
                    copyOfCardData[4].amount = data?.done_count || 0;

                    setCardDataInfo(copyOfCardData)
                    setLoading(false);
                },
                error: (error) => {
                    console.log("error ==>", error);
                    setLoading(false);
                },
            })
        );
    }


    const onCloseModal = (isClose, isApiCall) => {
        setCreateAppointmentModal(isClose);
        if (isApiCall) {
            setFilters({
                ...filters,
                date: format(date, "yyyy-MM-dd"),
            })
        }
    };


    return (
        <>
            <Layout>
                <Container>
                    {/* Loader and authorization check */}
                    {pageLoad && <CustomLoader />}
                    {/* {!pageLoad && !permissions && <Unauthenticated />} */}

                    {/* Page content */}
                    {!pageLoad &&
                        <>
                            <PageTitle title="Dashboard" className=" font-normal" />

                            <div className='flex flex-col sm:flex-row items-end sm:justify-between mb-5 gap-3'>
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
                                                setFilters({ ...filters, date: format(date, "yyyy-MM-dd") })
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    variants="primary"
                                    className="w-fit"
                                    onClick={() => setCreateAppointmentModal(true)}
                                >
                                    Book an appointment
                                </Button>

                                {/* Create Appointment Modal */}
                                {/* {appointmentPermissions?.appointmentCreate &&
                  <CreateAppointment
                    showCreateModal={createAppointmentModal}
                    onCloseModal={onCloseModal}
                  />
                } */}
                            </div>


                            <CardContent className="gap-5 mb-10 p-3 md:p-5">
                                {/* loader for MiniCard */}
                                {loading &&
                                    <div className='min-h-24 flex justify-center items-center'>
                                        <Spinner size='lg' />
                                    </div>
                                }
                                {/* Dashboard statistics */}
                                {!loading && <MiniCard cardData={cardDataInfo || cardData} />}


                                {/* loader for List of Appointments */}
                                {loading &&
                                    <div className='min-h-24 flex justify-center items-center'>
                                        <Spinner size='lg' />
                                    </div>
                                }
                                {/* Dashboard appointments list */}
                                {/* {!loading && <ListOfTasks date={date} />} */}

                            </CardContent>


                        </>
                    }
                </Container>
            </Layout>
        </>
    );
};

export default Dashboard;
