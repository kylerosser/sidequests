import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { SetPageTitle } from "../common/SetPageTitle";
import { Navbar } from '../common/Navbar'

export const PageLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    // Detect if we are in the login/signup pages to hide redundant button in navbar
    const isLoginPage = location.pathname == "/login";
    const isSignupPage = location.pathname == "/signup";

    return (
        <>  
            <SetPageTitle />
            <Navbar hideSignupButton={isLoginPage} hideLoginButton={isSignupPage}/>
            <div className="h-screen overflow-x:hidden pt-15">
                {children}
            </div>
        </>
    )
}