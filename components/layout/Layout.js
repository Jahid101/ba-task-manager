import CustomLoader from '@/components/loader/loader';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SideNavbar from './SideNavbar';
import TopBar from './Topbar';

const Layout = ({ children }) => {
    const router = useRouter();
    const { userDetails } = useSelector((state) => state.usersSlice);
    const { toast } = useToast()
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userDetails && userDetails?.id) {
            setIsLoading(false);
        } else {
            toast({
                variant: "error",
                title: "Please login first.",
            })
            router.push('/')
        }
    }, []);

    if (loading) {
        return (<CustomLoader />)
    }

    return (
        <div className='w-full'>
            <TopBar />
            <div className='flex'>
                <SideNavbar />
                {children}
            </div>
        </div>
    );
};

export default Layout;
