import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from '@/components/ui/password-input';
import { useToast } from '@/components/ui/use-toast';
import { setUserDetails } from '@/redux/user/usersSlice';
import { usersAPIs } from '@/utility/api/usersApi';
import { changeThemeColor, handleErrorMessage } from '@/utility/utilityFunctions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';


const RegistrationForm = () => {
    const [loading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { toast } = useToast()

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
        setIsLoading(true);

        let userCredentials = {
            name: data.name?.trim(),
            email: data.email?.trim(),
            loginType: 'email',
            password: data.password,
            preferences: {
                showPriorityFilter: true,
                showStatusFilter: true,
                showDateFilter: true,
                themeColor: '#04818c',
            },
        };

        try {
            const response = await usersAPIs.loginUser(userCredentials)
            if (response?.length > 0) {
                toast({
                    variant: "error",
                    title: "User already exists",
                })
                setIsLoading(false);
                return;
            }
        } catch (error) {
            // console.log("error ==>", error);
        }


        try {
            const response = await usersAPIs.createUser(userCredentials)

            if (response) {
                const user = response;
                delete user.password;

                // console.log('response ==>', response);

                if (user?.id) {
                    changeThemeColor(user?.preferences?.themeColor);
                    dispatch(setUserDetails(user));
                    toast({
                        variant: "success",
                        title: "Account created successfully.",
                        description: "Redirecting to dashboard...",
                    })
                    router.push('/dashboard')
                } else {
                    toast({
                        variant: "error",
                        title: "Account create failed",
                    })
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: "Account create failed",
            })
            setIsLoading(false);
        }
    }


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    id="name"
                                    type="name"
                                    placeholder="Name"
                                    autoComplete="off"
                                    {...field}
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                />
                            </FormControl>
                            <FormMessage>
                                {
                                    handleErrorMessage(errors, "name") ? (
                                        <span className="font-medium text-xs mt-0">
                                            {handleErrorMessage(errors, "name")}
                                        </span>
                                    ) : null
                                }
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    {...field}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                            </FormControl>
                            <FormMessage>
                                {
                                    handleErrorMessage(errors, "email") ? (
                                        <span className="font-medium text-xs mt-0">
                                            {handleErrorMessage(errors, "email")}
                                        </span>
                                    ) : null
                                }
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="off"
                                    {...field}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                            </FormControl>
                            <FormMessage>
                                {
                                    handleErrorMessage(errors, "password") ? (
                                        <span className="font-medium text-xs mt-0">
                                            {handleErrorMessage(errors, "password")}
                                        </span>
                                    ) : null
                                }
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <Button
                    className="mt-4 w-full"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    loading={loading}
                >
                    Register
                </Button>
            </form>
        </Form>
    );
};

export default RegistrationForm;
