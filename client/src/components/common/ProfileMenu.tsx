import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/useAuth";

import { Button } from '../../components/common/Button'
//import { Hyperlink } from '../../components/common/Hyperlink'

import avatarIconImage from '/account_circle_24dp_193E55_FILL0_wght200_GRAD0_opsz24.svg';

export const ProfileMenu = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [logOutLoading, setLogOutLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        if (logOutLoading) return;
        setLogOutLoading(true);
        const logOutResponse = await logout();
        setOpen(false);
        setLogOutLoading(false);
        if (logOutResponse.success) {
            navigate('/login');
        }
    }

    return (
    <div className="relative inline-block">
        <div onClick={() => setOpen(!open)} className="flex justify-between inline-flex items-center cursor-pointer bg-white border-1 border-sq-grey hover:bg-sq-grey rounded-full p-1">
            <img src={avatarIconImage} className="h-8 mr-2 select-none" alt="Profile Avatar"/>
            <p className="mr-2 select-none">{user?.username}</p>
        </div>

        {open && (
            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-32 bg-white shadow-md rounded-lg border border-gray-200 z-10">
            {/* Bubble arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />
            
            <div className="p-3 flex flex-col items-center text-center">
                {/* TODO: <Hyperlink onClick={() => setOpen(!open)} className="text-sm/6" href="/profile">View Profile</Hyperlink> */}
                <Button loading={logOutLoading} onClick={handleLogOut} className="w-full" variant='secondary'>Log out</Button>
            </div>
            </div>
        )}
    </div>
    )
}