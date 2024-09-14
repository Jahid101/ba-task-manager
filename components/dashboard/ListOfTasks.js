import AppointmentTable from "@/components/appointment/AppointmentTable";
import CardContent from "@/components/customUI/CardContent";
import PageTitle from "@/components/customUI/PageTitle";
import { useToast } from "@/components/ui/use-toast";
import { appointmentDispatcher } from "@/redux-toolkit/appointment/appointmentsSlice";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ListOfTasks = ({ date }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const { userToken } = useSelector((state) => state.usersSlice);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    page: 0,
    per_page: 5,
    search: "",
    date: format(date, "yyyy-MM-dd"),
  });

  const columns = [
    {
      header: "Appointment #",
      accessorKey: "appointment_no",
    },
    {
      header: "Patient ID",
      accessorKey: "patient.patient_number",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Patient Name",
      accessorKey: "patient.first_name",
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
  ];

  useEffect(() => {
    getAppointmentList();
  }, []);

  const getAppointmentList = () => {
    setLoading(true);
    dispatch(
      appointmentDispatcher.getAppointmentList(filters, userToken, {
        success: (response) => {
          setData(response?.data);
          setLoading(false);
        },
        error: (error) => {
          console.log("error ==>", error);
          toast({
            variant: "error",
            title: "Something went wrong",
          });
          setLoading(false);
        },
      })
    );
  };


  return (
    <CardContent className="mb-7">
      <PageTitle title="List of appointments" className="text-xl mt-5 md:mt-0 mb-0" />

      {/* Appointment list Table */}
      <AppointmentTable columns={columns} data={data} loading={loading} setSelectedUser={setSelectedUser} />
      <div>
        <Link className="text-primary text-sm underline float-right" href="/appointment">
          View all appointments
        </Link>
      </div>
    </CardContent>
  );
};

export default ListOfTasks;
