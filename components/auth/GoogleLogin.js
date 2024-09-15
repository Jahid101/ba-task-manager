import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { changeThemeColor } from '@/utility/utilityFunctions';
import { setUserDetails } from '@/redux/user/usersSlice';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { usersAPIs } from '@/utility/api/usersApi';


const GoogleLogin = ({ className }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)


    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { access_token } = tokenResponse;
                const userInfo = await axios.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );
                // console.log('userInfo ===>', userInfo?.data);
                saveUserinfo(userInfo?.data)

            } catch (error) {
                console.error("Google login error:", error);
                toast({
                    variant: "error",
                    title: "Login failed",
                })
                setLoading(false)
            }
        },
        onError: (error) => {
            console.error("Login failed:", error)
            toast({
                variant: "error",
                title: "Login failed",
            })
            setLoading(false)
        },
    });



    const saveUserinfo = async (userInfo) => {
        let userCredentials = {
            name: userInfo?.name,
            email: userInfo?.email,
            loginType: 'google',
            password: '',
            picture: userInfo?.picture,
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
                if (response[0]?.loginType == 'email') {
                    toast({
                        variant: "error",
                        title: "User already registered with different login type",
                    })
                    setLoading(false);
                    return;
                } else {
                    let user = { ...response[0] }
                    changeThemeColor(user?.preferences?.themeColor);
                    dispatch(setUserDetails(user));
                    router.push('/dashboard')
                    toast({
                        variant: "success",
                        title: "Login successful",
                    })
                    return;
                }
            }
        } catch (error) {
            // console.log("error ==>", error);
        }


        try {
            const response = await usersAPIs.createUser(userCredentials)
            if (response) {
                const user = {...response};
                delete user.password;

                // console.log('response ==>', response);

                if (user?.id) {
                    changeThemeColor(user?.preferences?.themeColor);
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
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: "Login failed",
            })
            setLoading(false);
        }
    }



    return (
        <div className={className}>
            <Button
                className="w-full"
                size="lg"
                onClick={() => {
                    // setLoading(true)
                    googleLogin()
                }}
                disabled={loading}
                loading={loading}
            >
                <FaGoogle />
                &nbsp;
                Login with google
            </Button>
        </div>
    );
};

export default GoogleLogin;
