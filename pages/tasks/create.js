import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import Layout from '@/components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import dynamic from 'next/dynamic';

const Breadcrumb = dynamic(() => import('@/components/ui/breadcrumb'), {
    loading: () => <Spinner size="sm" className='mt-1' />,
    ssr: false,
});
const TaskForm = dynamic(() => import('@/components/task/TaskForm'), {
    loading: () => <Spinner size="sm" className='mt-1' />,
    ssr: false,
});


const TasksCreatePage = () => {

    return (
        <Layout>
            <Container>
                <Breadcrumb
                    backLink={'/tasks'}
                    items={
                        [
                            {
                                title: "Create Task",
                            }
                        ]
                    }
                />
                <CardContent className="bg-white mb-7 shadow-lg">
                    <TaskForm />
                </CardContent>
            </Container>
        </Layout>
    );
};

export default TasksCreatePage;