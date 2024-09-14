import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import Layout from '@/components/layout/Layout';
import TaskForm from '@/components/task/TaskForm';
import Breadcrumb from '@/components/ui/breadcrumb';

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