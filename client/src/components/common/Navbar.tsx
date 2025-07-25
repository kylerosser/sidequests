import { useAuth } from "../../auth/useAuth";

import { Button } from '../common/Button'
import { ProfileMenu } from "./ProfileMenu";
import { Link } from "react-router-dom"

import wordmarkImage from '/wordmark.svg';

type NavbarProps = {
  hideSignupButton?: boolean;
  hideLoginButton?: boolean;
};

export const Navbar = ({ hideSignupButton = false, hideLoginButton = false }: NavbarProps) => {
    const { user } = useAuth();

    // Buttons for logging in / signing up to be displayed if the user is not currently logged in
    const loginSignupButtons = <div className="flex justify-between inline-flex items-center">
        <Link className={`mx-1 ${hideSignupButton ? "hidden" : ""}`} to="/login"><Button>Log in</Button></Link>
        <Link className={`mx-1 ${hideLoginButton ? "hidden" : ""}`} to="/signup"><Button variant="white">Sign Up</Button></Link>
    </div>

    // User profile info to be displayed if the user is currently logged in
    const userInfo = <ProfileMenu/>

    return (
        <nav className="bg-white border-1 border-sq-grey fixed w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1.5 h-15">
                <div className="flex items-center space-x-3 cursor-pointer">
                    <Link to="/"><img src={wordmarkImage} className="h-8" alt="Sidequests Logo"/></Link>
                </div>
                
                {user == null ? loginSignupButtons : userInfo}
            </div>
        </nav>
    )
}