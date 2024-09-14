import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import TaskForm from "./TaskForm";


const CreateTask = ({ showCreateModal, onCloseModal, defaultPatient = null }) => {
    const [loading, setLoading] = useState(false);


    return (
        <Dialog
            open={showCreateModal}
            onOpenChange={(open) => onCloseModal(open)}
        >
            <DialogContent
                className='max-w-3xl max-h-[95vh] overflow-y-auto'
                // className='max-w-3xl max-h-[750px] overflow-y-auto'
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle>Create new task</DialogTitle>

                    {loading ?
                        <div className='flex justify-center items-center h-40'>
                            <Spinner size={'lg'} />
                        </div>
                        :
                        <DialogDescription DialogDescription className="pt-2">
                            {/* Task form */}
                            <TaskForm
                                btnText='Create'
                                onCloseModal={onCloseModal}
                            />
                        </DialogDescription>
                    }
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTask;
