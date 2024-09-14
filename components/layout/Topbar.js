import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { setUserDetails } from "@/redux/user/usersSlice";
import { Constants } from "@/utility/constants";
import { useDebouncedValue } from "@/utility/utilityFunctions";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../public/images/logo.jpg';


const TopBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchLoad, setSearchLoad] = useState(false);
    const [data, setData] = useState(null);
    const [openList, setOpenList] = useState(false);
    const { toast } = useToast()
    const { userDetails } = useSelector((state) => state.usersSlice);

    const handleLogout = () => {
        dispatch(setUserDetails(null));
        router.push("/");
    };



    return (
        <div className='flex justify-between w-full items-center mt-1 border-b py-1 shadow'> {/* max-w-[1850px] */}
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
                            <AvatarImage src={userDetails?.avatar ? Constants.mediaUrl + userDetails?.avatar : null} />
                            <AvatarFallback className="uppercase">{userDetails?.first_name ? userDetails?.first_name[0] : 'A'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <div className="flex items-center py-1">
                            <Avatar className="cursor-pointer border border-solid border-slate-300">
                                <AvatarImage src={userDetails?.avatar ? Constants.mediaUrl + userDetails?.avatar : null} />
                                <AvatarFallback className='uppercase'>{userDetails?.first_name ? userDetails?.first_name[0] : 'A'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <DropdownMenuLabel className="pb-0">{userDetails?.name}</DropdownMenuLabel>
                                <p className="text-xs px-2">{userDetails?.role_name}</p>
                                <p className="text-xs px-2">{userDetails?.email}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push('/profile')}
                            className='cursor-pointer py-3'
                        >
                            <CgProfile /> &nbsp;&nbsp;&nbsp; My Account
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleLogout()}
                            className='cursor-pointer py-3'
                        >
                            <FiLogOut /> &nbsp;&nbsp;&nbsp; Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    );
};

export default TopBar;
