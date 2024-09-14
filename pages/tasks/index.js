import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import CustomLoader from '@/components/loader/loader';
import CreateTask from '@/components/task/CreateTask';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Constants } from '@/utility/constants';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const TaskListPage = () => {
    const { userDetails } = useSelector((state) => state.usersSlice);
    const [pageLoad, setPageLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [data, setData] = useState([]);
    const [practitionerList, setPractitionerList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [pageMeta, setPageMeta] = useState({});
    const [date, setDate] = useState(new Date())
    const printRef = useRef();
    const [printVisible, setPrintVisible] = useState(false);
    const [filters, setFilters] = useState({
        page: 0,
        per_page: 10,
        search: '',
        date: format(new Date(), "yyyy-MM-dd"),
        type: null,
        practitioner: null,
        sort_by: null,
    });

    const columns = [
        {
            header: "Appointment #",
            accessorKey: "appointment_no",
            align: 'left'
        },
        {
            header: "Patient ID",
            accessorKey: "patient.patient_number",
            align: 'left'
        },
        {
            header: "Type",
            accessorKey: "type",
        },
        {
            header: "Patient Name",
            accessorKey: "patient.first_name",
            align: 'left'
        },
        {
            header: "DOB",
            accessorKey: "patient.date_of_birth",
        },
        {
            header: "Practitioner",
            accessorKey: "user.first_name",
        },
        {
            header: "Serial #",
            accessorKey: "serial_no",
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
        // getAppointmentList()
    }, [filters]);


    const getAppointmentList = () => {
        setLoading(true);
        dispatch(
            appointmentDispatcher.getAppointmentList(filters, userToken, {
                success: (response) => {
                    setData(response?.data)
                    setPageMeta(response?.meta)
                    setLoading(false);
                },
                error: (error) => {
                    console.log("error ==>", error);
                    toast({
                        variant: "error",
                        title: 'Something went wrong',
                    })
                    setLoading(false);
                },
            })
        );
    }


    const handleArchive = () => {
        setArchiveLoading(true);
        dispatch(
            appointmentDispatcher.archiveAppointment(selectedData?.id, userToken, {
                success: (response) => {
                    toast({
                        variant: "success",
                        title: 'Appointment archived successfully',
                    })
                    getAppointmentList();
                    setArchiveLoading(false);
                    setOpenAlert(false);
                },
                error: (error) => {
                    console.log("error ==>", error);
                    toast({
                        variant: "error",
                        title: 'Something went wrong',
                    })
                    setArchiveLoading(false);
                },
            })
        );
    }

    const onCloseModal = (isClose, isApiCall) => {
        setCreateModal(isClose);
        if (isApiCall) {
            getAppointmentList()
        }
    }



    return (
        <Layout>
            <Container>
                {/* Loader and authorization check */}
                {pageLoad && <CustomLoader />}

                {/* Page content */}
                {!pageLoad &&
                    <>
                        <PageTitle title="Appointment" />

                        <div className='flex flex-col sm:flex-row items-end sm:justify-between mb-5 gap-3'>
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
                                            setFilters({ ...filters, date: format(date, "yyyy-MM-dd") })
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Button
                                variants="primary"
                                className="w-fit"
                                onClick={() => setCreateModal(true)}
                            >
                                Create a Task
                            </Button>

                            {/* {Create Modal */}
                            <CreateTask
                                showCreateModal={createModal}
                                onCloseModal={onCloseModal}
                            />
                        </div>

                        <CardContent className="bg-white gap-0">
                            {/* Filters */}
                            <div className='flex items-end gap-5 flex-wrap'>
                                <div className="w-full sm:w-72">
                                    <p className='text-md text-primary mb-1'>Filter By appointment type</p>

                                    <Select
                                        value={filters.type}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, type: value })
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Appointment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={null}>None</SelectItem>
                                            <SelectItem value="first_appointment">First appointment</SelectItem>
                                            <SelectItem value="follow_up">Follow up</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="to_be_determined">To be determined</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-full sm:w-72">
                                    <p className='text-md text-primary mb-1'>Filter By Practitioners</p>

                                    <Select
                                        value={filters.practitioner}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, practitioner: value })
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Practitioner" />
                                        </SelectTrigger>
                                        <SelectContent className='max-h-96' >
                                            <SelectItem value={null}>None</SelectItem>

                                            {practitionerList?.length > 0 && practitionerList?.map((item, index) => {
                                                return (
                                                    <SelectItem SelectItem
                                                        key={item?.id + index}
                                                        value={item?.id}
                                                    >
                                                        <div className='flex items-center gap-3'>
                                                            <Avatar className="cursor-pointer border border-solid border-slate-300 h-8 w-8">
                                                                <AvatarImage src={item?.avatar ? Constants.mediaUrl + item?.avatar : null} />
                                                                <AvatarFallback className="uppercase">{item?.first_name[0]}</AvatarFallback>
                                                            </Avatar>

                                                            <p>{item?.first_name + ' ' + item?.last_name}</p>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-full sm:w-72">
                                    <p className='text-md text-primary mb-1'>Sort By</p>

                                    <Select
                                        value={filters.sort_by}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, sort_by: value })
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={null}>None</SelectItem>
                                            <SelectItem value="name">By name</SelectItem>
                                            <SelectItem value="time_slot">By slot time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className='flex justify-end mt-2'>
                                <p
                                    className='cursor-pointer underline text-tertiary'
                                    onClick={() => {
                                        setDate(new Date())
                                        setSearchText('')
                                        setFilters({
                                            page: 0,
                                            per_page: 10,
                                            search: '',
                                            date: format(new Date(), "yyyy-MM-dd"),
                                            type: null,
                                            practitioner: null,
                                            sort_by: null,
                                        })
                                    }}
                                >
                                    Clear filter
                                </p>
                            </div>

                            <>
                                <PageTitle title="List of Appointments" className='text-xl mt-5 md:mt-3 mb-3' />

                                {/* Appointment list Table */}
                                <TaskTable
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    setOpenAlert={setOpenAlert}
                                    setSelectedData={setSelectedData}
                                />

                                {/* {data?.length > 0 &&
                                    <Pagination
                                        total={pageMeta?.total}
                                        limit={filters?.per_page}
                                        setPage={(page) => {
                                            setFilters({ ...filters, page: page?.selected })
                                        }}
                                        selectedPage={filters?.page}
                                    />
                                } */}
                            </>

                            {/* Alert for archive */}
                            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will archive the appointment
                                            and remove the data from the list.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button
                                            onClick={() => handleArchive()}
                                            loading={archiveLoading}
                                            disabled={archiveLoading}
                                        >
                                            Archive
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </>
                }
            </Container>
        </Layout >
    );
};

export default TaskListPage;
