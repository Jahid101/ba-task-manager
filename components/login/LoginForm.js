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
import { handleErrorMessage } from '@/utility/utilityFunctions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';


const LoginForm = () => {
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
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        setIsLoading(true);

        let userCredentials = {
            email: data.email?.trim(),
            password: data.password,
        };

        try {
            const response = await usersAPIs.loginUser(userCredentials)

            if (response?.length > 0) {
                const user = response[0];
                delete user.password;

                // console.log('response ==>', response[0]);

                if (user?.id) {
                    dispatch(setUserDetails(user));
                    toast({
                        variant: "success",
                        title: "Login successful",
                    })
                    router.push('/dashboard')
                } else {
                    toast({
                        variant: "error",
                        title: "Login failed",
                    })
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log("error ==>", error);

            if (error?.response?.data == "Not found") {
                toast({
                    variant: "error",
                    title: "Invalid login credentials",
                })
                setIsLoading(false);
                return
            }

            toast({
                variant: "error",
                title: "Login failed",
            })
            setIsLoading(false);
        }
    }



    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3"
            >
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
                                {/* <Input
                                                id="password"
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="off"
                                                {...field}
                                                {...register("password", {
                                                    required: "Password is required",
                                                })}
                                            /> */}
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
                    Login
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
