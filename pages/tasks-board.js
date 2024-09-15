import CardContent from '@/components/customUI/CardContent';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import Container from '@/components/tasksBoard/Container';
import { tasksAPIs } from '@/utility/api/taskApi';
import { useEffect, useState } from 'react';

// const TasksBoardDnD = dynamic(() => import('@/components/tasksBoard/TasksBoardDnD'), {
//     loading: () => <Spinner size="sm" className='mt-1' />,
//     ssr: false,
// });


const TasksBoardPage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});


    useEffect(() => {
        getTasksList()
    }, []);


    const getTasksList = async () => {
        setLoading(true);

        try {
            const response = await tasksAPIs.getAllTask()
            if (response) {
                // console.log('response ==>', response);

                let taskList = [...response];
                taskList?.reverse()

                let pendingTasks = taskList?.filter(item => item.status == "Pending")
                let inProgressTasks = taskList?.filter(item => item.status == "In Progress")
                let completedTasks = taskList?.filter(item => item.status == "Completed")

                let tasksForDnd = {
                    pending: pendingTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
                }
                setData(tasksForDnd)
                setLoading(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            if (error?.response?.data == "Not found") {
                setData({})
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
        <Layout>
            <Container>
                <PageTitle title="Dashboard" className="font-normal" />

                <CardContent className="bg-white mb-7 shadow-lg">
                    hi
                    {/* <SortableGrid /> */}
                    {/* <TasksBoardDnD
                        data={data}
                        loading={loading}
                        setLoading={setLoading}
                    /> */}
                </CardContent>
            </Container>
        </Layout>
    );
};

export default TasksBoardPage;
