import { useAuth } from "../../auth/useAuth";

import { Button } from '../common/Button'

import iconImage from '/icon.svg';

type NavbarProps = {
  hideSignupButton?: boolean;
  hideLoginButton?: boolean;
};

export const Navbar = ({ hideSignupButton = false, hideLoginButton = false }: NavbarProps) => {
    const { user } = useAuth();
    console.log(user != null)

    // Buttons for logging in / signing up to be displayed if the user is not currently logged in
    const loginSignupButtons = <>
        <a className={`mx-1 ${hideSignupButton ? "hidden" : ""}`} href="/login"><Button>Log in</Button></a>
        <a className={`mx-1 ${hideLoginButton ? "hidden" : ""}`} href="/signup"><Button variant="white">Create an account</Button></a>
    </>

    // User info to be displayed if the user is currently logged in
    const userInfo = <p>{user?.username}</p>

    return (
        <nav className="bg-white border-1 border-sq-grey top-0 start-0 fixed w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <a href="#" className="flex items-center space-x-3">
                    <img src={iconImage} className="h-8" alt="Sidequests Logo"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-sq-dark">Sidequests</span>
                </a>
                
                <div className="flex justify-between inline-flex items-center">
                    {user == null ? loginSignupButtons : userInfo}
                </div>
            </div>
        </nav>
    )
}