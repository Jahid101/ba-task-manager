import CardContent from '@/components/customUI/CardContent';
import Container from '@/components/customUI/Container';
import PageTitle from '@/components/customUI/PageTitle';
import Layout from '@/components/layout/Layout';
import SettingsForm from '@/components/setting/SettingsForm';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { setUserDetails } from '@/redux/user/usersSlice';
import { usersAPIs } from '@/utility/api/usersApi';
import { changeThemeColor } from '@/utility/utilityFunctions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const SettingPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.usersSlice);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);


    const handleDelete = async () => {
        setDeleteLoading(true);

        try {
            const response = await usersAPIs.deleteUser(userDetails?.id)
            if (response) {
                toast({
                    variant: "success",
                    title: 'Successfully deleted',
                })
                dispatch(setUserDetails(null));
                changeThemeColor();
                router.push('/')
                setDeleteLoading(false);
            }
        } catch (error) {
            console.log("error ==>", error);
            toast({
                variant: "error",
                title: 'Account delete failed',
            })
            setDeleteLoading(false);
        }
    }


    return (
        <Layout>
            <Container>
                <PageTitle title="Settings" />

                <CardContent className="bg-white mb-7 shadow-lg">
                    <SettingsForm />
                </CardContent>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 bg-white mb-10 shadow-lg">
                    <div className="space-y-0.5">
                        <p className="text-base">
                            Delete account
                        </p>
                        <p className='text-[#64748b]'>
                            This action will delete your account permanently.
                        </p>
                    </div>
                    <div>
                        <Button
                            variant="destructive"
                            onClick={() => setOpenAlert(true)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Alert for account delete */}
                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete your account permanently.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete()}
                                loading={deleteLoading}
                                disabled={deleteLoading}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Container>
        </Layout>
    );
};

export default SettingPage;
