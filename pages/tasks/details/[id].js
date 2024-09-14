import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import CustomLoader from '@/components/loader/loader';
import TaskForm from '@/components/task/TaskForm';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { tasksAPIs } from '@/utility/api/taskApi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TaskDetailsPage = () => {
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
                                title: "Task details",
                            }
                        ]
                    }
                />

                <CardContent className="bg-white mb-7 shadow-lg">
                    {data?.id ?
                        <>
                            <div className='text-right mb-0'>
                                <Button
                                    size='sm'
                                    onClick={() => router.push(`/tasks/edit/${data.id}`)}
                                >
                                    Edit
                                </Button>
                            </div>

                            <PageTitle title={data?.title} className="text-black mt-0 mb-0 font-semibold" />

                            <div className='flex flex-col sm:flex-row w-full gap-3 sm:gap-12 mb-3'>
                                <div className='w-full sm:w-[50%]'>
                                    <p className='break-all text-lg'>Id: {data?.id || "-"}</p>
                                    <p className='break-all text-lg'>Created by: {data?.createdBy || "-"}</p>
                                    <p className='break-all text-lg'>Created date: {new Date(data?.createdAt).toLocaleDateString("en-IN") || "-"}</p>
                                    <p className='break-all text-lg'>Created time: {new Date(data?.createdAt).toLocaleDateString("en-IN") || "-"}</p>
                                    <p className='break-all text-lg'>Description: {data?.description || "-"}</p>
                                </div>

                                <div className='w-full sm:w-[50%] gap-2'>
                                    <p className='break-all text-lg'>Priority: {data?.priority || "-"}</p>
                                    <p className='break-all text-lg'>Status: {data?.status || "-"}</p>
                                    <p className='break-all text-lg'>Updated by: {data?.updatedBy?.name || "-"}</p>
                                    <p className='break-all text-lg'>Updated date: {new Date(data?.createdAt).toLocaleDateString("en-IN") || "-"}</p>
                                    <p className='break-all text-lg'>Updated time: {new Date(data?.createdAt).toLocaleDateString("en-IN") || "-"}</p>
                                </div>
                            </div>
                        </>
                        :
                        <p className='text-center my-5'>No data found</p>
                    }
                </CardContent>

            </Container>
        </Layout>
    );
};

export default TaskDetailsPage;
