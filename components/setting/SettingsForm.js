import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { setUserDetails } from '@/redux/user/usersSlice';
import { usersAPIs } from '@/utility/api/usersApi';
import { changeThemeColor } from '@/utility/utilityFunctions';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const SettingsForm = () => {
    const { userDetails } = useSelector((state) => state.usersSlice);
    const { toast } = useToast();
    const dispatch = useDispatch();
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
            showPriorityFilter: true,
            showStatusFilter: true,
            showDateFilter: true,
            themeColor: '',
        },
    })

    useEffect(() => {
        if (userDetails && userDetails?.preferences) {
            reset(userDetails?.preferences)
        }
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);

        const payload = {
            ...userDetails,
            preferences: { ...data }
        }

        // console.log("payload", payload);

        delete payload?.id;
        delete payload?.createdAt;

        try {
            const response = await usersAPIs.updateUser(payload, userDetails?.id)

            if (response) {
                changeThemeColor(data?.themeColor);
                dispatch(setUserDetails(response));
                toast({
                    variant: "success",
                    title: "Settings updated successfully.",
                })
            } else {
                toast({
                    variant: "error",
                    title: "Settings update failed",
                })
            }
            setLoading(false);
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: "Settings update failed",
            })
            setLoading(false);
        }

    }


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <div className='flex flex-col lg:flex-row gap-5 lg:gap-8'>
                    <div className="space-y-3 w-full">
                        <FormField
                            control={control}
                            name="showPriorityFilter"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg gap-2 border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Priority filter
                                        </FormLabel>
                                        <FormDescription>
                                            Ability to filter by priority
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="showStatusFilter"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center gap-2 justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Status filter
                                        </FormLabel>
                                        <FormDescription>
                                            Ability to filter by status
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="space-y-3 w-full">
                        <FormField
                            control={control}
                            name="showDateFilter"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center gap-2 justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Date filter
                                        </FormLabel>
                                        <FormDescription>
                                            Ability to filter by due date
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="themeColor"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between gap-2 rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Theme color
                                        </FormLabel>
                                        <FormDescription>
                                            This action will effect all over the system
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <ColorPicker
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='text-right'>
                    <Button
                        className="mt-4 w-fit"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        loading={loading}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form >
    );
};

export default SettingsForm;