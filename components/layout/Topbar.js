import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { setUserDetails } from "@/redux/user/usersSlice";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiLogOut } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../public/images/logo.jpg';


const TopBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.usersSlice);

    const handleLogout = () => {
        dispatch(setUserDetails(null));
        router.push("/");
    };



    return (
        <div className='flex justify-between w-full items-center mt-1 border-b py-1 shadows'> {/* max-w-[1850px] */}
            <div className="w-[250px] ml-7 lg:ml-0">
                <Image
                    src={Logo}
                    style={{ margin: 'auto', cursor: 'pointer', marginBottom: '5px' }}
                    alt="Image alt"
                    // width={130}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                />
            </div>


            <div className="lg:ml-20 mx-5 lg:mr-10">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="cursor-pointer border border-solid border-slate-300">
                            <AvatarImage src={null} />
                            <AvatarFallback className="uppercase">{userDetails?.name ? userDetails?.name[0] : 'A'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className='mr-5'>
                        <div className="flex items-center py-1">
                            <Avatar className="cursor-pointer border border-solid border-slate-300">
                                <AvatarImage src={null} />
                                <AvatarFallback className='uppercase'>{userDetails?.name ? userDetails?.name[0] : 'A'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <DropdownMenuLabel className="py-0">{userDetails?.name}</DropdownMenuLabel>
                                <p className="text-xs px-2">{userDetails?.email}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push('/settings')}
                            className='cursor-pointer py-3'
                        >
                            <IoSettingsOutline /> &nbsp;&nbsp; Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleLogout()}
                            className='cursor-pointer py-3'
                        >
                            <FiLogOut /> &nbsp;&nbsp; Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    );
};

export default TopBar;
