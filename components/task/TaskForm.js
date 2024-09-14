import React from 'react';
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

const TaskForm = ({
    btnText = 'Create',
    onCloseModal,
}) => {
    const [loading, setLoading] = useState(false);


    const {
        register,
        formState: { errors, isSubmitting, isValid },
        handleSubmit,
        control,
    } = useForm({ mode: "all" });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })


    const onSubmit = async (data) => {

        onCloseModal(false);
    }


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
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
                                        required: "Description is required",
                                    })}
                                />
                            </FormControl>
                            <FormMessage>
                                {
                                    handleErrorMessage(errors, "description") ? (
                                        <span className="font-medium text-xs mt-0">
                                            {handleErrorMessage(errors, "description")}
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
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        {...field}
                                        {...register("dueDate", {
                                            required: "Date is required",
                                        })}
                                    />
                                </PopoverContent>
                            </Popover>
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

                {/* <FormField
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Due date:</FormLabel>
                            <div className='flex justify-between items-center mt-3'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full sm:w-72 pl-3 text-left font-normal justify-start",
                                                    !field.valu && "text-muted-foreground"
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
                                            // onSelect={(date) => {
                                            //     setDate(date)
                                            //     setOpenDatePicker(false)
                                            //     setFilters({ ...filters, date: format(date, "yyyy-MM-dd") })
                                            // }}
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
                /> */}

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