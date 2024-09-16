import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import { tasksAPIs } from '@/utility/api/taskApi';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const TasksBoardDnD = dynamic(() => import('@/components/tasksBoard/TasksBoardDnD'), {
    loading: () => <Spinner size="md" className='mt-1' />,
    ssr: false,
});


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
                <PageTitle title="Tasks board" className="font-normal" />

                <CardContent className="bg-white mb-7 shadow-lg">
                    <TasksBoardDnD
                        data={data}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </CardContent>
            </Container>
        </Layout>
    );
};

export default TasksBoardPage;
