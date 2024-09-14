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
                setData(response);
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

                            <PageTitle title={data?.title} className="text-black mt-0 mb-0 font-bold" />

                            <div className='flex flex-col sm:flex-row w-full gap-3 sm:gap-12 mb-3'>
                                <div className='w-full sm:w-[50%]'>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Id:</span>
                                        &nbsp;
                                        <span>{data?.id || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Created by:</span>
                                        &nbsp;
                                        <span>{data?.createdBy || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Created date:</span>
                                        &nbsp;
                                        <span>{new Date(data?.createdAt).toLocaleDateString("en-IN") || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Created time:</span>
                                        &nbsp;
                                        <span>{new Date(data?.createdAt).toLocaleTimeString() || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Description:</span>
                                        &nbsp;
                                        <span>{data?.description || "-"}</span>
                                    </p>
                                </div>

                                <div className='w-full sm:w-[50%] gap-2'>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Priority:</span>
                                        &nbsp;
                                        <span>{data?.priority || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Status:</span>
                                        &nbsp;
                                        <span>{data?.status || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Updated by:</span>
                                        &nbsp;
                                        <span>{data?.updatedBy?.name || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Updated date:</span>
                                        &nbsp;
                                        <span>{new Date(data?.updatedBy?.date).toLocaleDateString("en-IN") || "-"}</span>
                                    </p>
                                    <p className='break-all'>
                                        <span className='font-semibold'>Updated time:</span>
                                        &nbsp;
                                        <span>{new Date(data?.updatedBy?.date).toLocaleTimeString() || "-"}</span>
                                    </p>
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
