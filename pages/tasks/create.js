import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import TaskForm from '@/components/task/TaskForm';

const TasksCreatePage = () => {

    return (
        <Layout>
            <Container>
                <PageTitle title="Create Task" className=" font-normal" />
                <CardContent className="bg-white mb-7 shadow-lg">
                    <TaskForm />
                </CardContent>
            </Container>
        </Layout>
    );
};

export default TasksCreatePage;