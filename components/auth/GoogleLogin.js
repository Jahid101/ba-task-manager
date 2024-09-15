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
                console.log('userInfo ===>', userInfo?.data);

                // changeThemeColor(user?.preferences?.themeColor);
                // dispatch(setUserDetails(user));
                // router.push('/dashboard')
                toast({
                    variant: "success",
                    title: "Login successful",
                })
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


    return (
        <div className={className}>
            <Button
                className="w-full"
                size="lg"
                onClick={() => {
                    setLoading(true)
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
