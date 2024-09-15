import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { handleErrorMessage } from '@/utility/utilityFunctions';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { tasksAPIs } from '@/utility/api/taskApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const TaskForm = ({
    btnText = 'Create',
    isEdit = false,
    data = null,
}) => {
    const { userDetails } = useSelector((state) => state.usersSlice);
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);


    const {
        register,
        formState: { errors, isSubmitting, isValid },
        handleSubmit,
        reset,
        control,
    } = useForm({ mode: "all" });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        if (isEdit) {
            reset(data)
        }
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);

        const payload = {
            ...data,
            createdBy: {
                name: userDetails?.name,
                date: new Date(),
            },
            dueDate: format(new Date(data.dueDate), 'yyyy-MM-dd'),
        }

        // console.log("payload", payload);

        if (isEdit) {
            delete payload?.id;
            delete payload?.createdBy;
            payload.updatedBy = {
                name: userDetails?.name,
                date: new Date(),
            }

            try {
                const response = await tasksAPIs.updateTask(payload, data?.id)

                if (response) {
                    toast({
                        variant: "success",
                        title: "Task updated successfully.",
                    })
                    router.push('/tasks')
                } else {
                    toast({
                        variant: "error",
                        title: "Task update failed",
                    })
                }
                setLoading(false);
            } catch (error) {
                console.log("error ==>", error);
                toast({
                    variant: "error",
                    title: "Task update failed",
                })
                setLoading(false);
            }
        } else {
            try {
                const response = await tasksAPIs.createTask(payload)

                if (response) {
                    toast({
                        variant: "success",
                        title: "Task created successfully.",
                    })
                    router.push('/tasks')
                } else {
                    toast({
                        variant: "error",
                        title: "Task create failed",
                    })
                    setLoading(false);
                }
            } catch (error) {
                console.log("error ==>", error);
                toast({
                    variant: "error",
                    title: "Task create failed",
                })
                setLoading(false);
            }
        }
    }


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <div className='flex flex-col lg:flex-row gap-5 lg:gap-10'>
                    <div className="space-y-3 w-full">
                        <FormField
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="title"
                                            type="text"
                                            placeholder="Title"
                                            autoComplete="off"
                                            {...field}
                                            {...register("title", {
                                                required: "Title is required",
                                            })}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {
                                            handleErrorMessage(errors, "title") ? (
                                                <span className="font-medium text-xs mt-0">
                                                    {handleErrorMessage(errors, "title")}
                                                </span>
                                            ) : null
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due date:</FormLabel>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal justify-start",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                        {field.value ? (
                                                            format(field.value, "dd-MM-yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    required={true}
                                                    disabled={(date) => {
                                                        const comparingDate = format(date, "yyyy-MM-dd")
                                                        const today = format(new Date(), "yyyy-MM-dd")

                                                        if (comparingDate < today) {
                                                            return true;
                                                        }
                                                    }}
                                                    {...field}
                                                    {...register("dueDate", {
                                                        required: "Date is required",
                                                    })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <FormMessage>
                                        {
                                            handleErrorMessage(errors, "dueDate") ? (
                                                <span className="font-medium text-xs mt-0">
                                                    {handleErrorMessage(errors, "dueDate")}
                                                </span>
                                            ) : null
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="space-y-3 w-full">
                        <FormField
                            control={control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Priority:</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                        {...register("priority", {
                                            required: "Priority is required",
                                        })}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>
                                        {
                                            handleErrorMessage(errors, "priority") ? (
                                                <span className="font-medium text-xs mt-0">
                                                    {handleErrorMessage(errors, "priority")}
                                                </span>
                                            ) : null
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Status:</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                        {...register("status", {
                                            required: "Status is required",
                                        })}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>
                                        {
                                            handleErrorMessage(errors, "status") ? (
                                                <span className="font-medium text-xs mt-0">
                                                    {handleErrorMessage(errors, "status")}
                                                </span>
                                            ) : null
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Description:</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description"
                                    className="resize-none"
                                    {...field}
                                    {...register("description", {
                                        required: false,
                                    })}
                                />
                            </FormControl>
                            {/* <FormMessage>
                                {
                                    handleErrorMessage(errors, "description") ? (
                                        <span className="font-medium text-xs mt-0">
                                            {handleErrorMessage(errors, "description")}
                                        </span>
                                    ) : null
                                }
                            </FormMessage> */}
                        </FormItem>
                    )}
                />


                <div className='text-right'>
                    <Button
                        className="mt-4 w-fit"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        loading={loading}
                    >
                        {btnText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TaskForm;