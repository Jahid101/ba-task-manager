import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import Layout from '@/components/layout/Layout';
import CustomLoader from '@/components/loader/loader';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { tasksAPIs } from '@/utility/api/taskApi';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Breadcrumb = dynamic(() => import('@/components/ui/breadcrumb'), {
    loading: () => <Spinner size="sm" className='mt-1' />,
    ssr: false,
});
const TaskForm = dynamic(() => import('@/components/task/TaskForm'), {
    loading: () => <Spinner size="sm" className='mt-1' />,
    ssr: false,
});


const TasksEditPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [pageLoad, setPageLoad] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        if (router.isReady) {
            if (router?.query?.id && router?.query?.id != "") {
                getTaskByID(router?.query?.id);
            }
        }
    }, [router.isReady]);


    const getTaskByID = async (id) => {
        try {
            const response = await tasksAPIs.getTaskById(id)
            if (response) {
                // console.log('response', response);
                let taskInfo = { ...response }
                delete taskInfo.createdAt

                setData(taskInfo);
                setPageLoad(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: 'Task not found',
            })
            setPageLoad(false);
        }
    }


    if (pageLoad) {
        return (<CustomLoader />)
    }


    return (
        <Layout>
            <Container>
                <Breadcrumb
                    backLink={'/tasks'}
                    items={
                        [
                            {
                                title: "Update Task",
                            }
                        ]
                    }
                />
                <CardContent className="bg-white mb-7 shadow-lg">
                    {data?.id ?
                        <TaskForm
                            btnText='Update'
                            isEdit={true}
                            data={data}
                        />
                        :
                        <p className='text-center my-5'>No data found</p>
                    }
                </CardContent>
            </Container>
        </Layout>
    );
};

export default TasksEditPage;
