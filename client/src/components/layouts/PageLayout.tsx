import type { ReactNode } from "react";

import { useLocation } from "react-router-dom";

import { Navbar } from '../common/Navbar'

export const PageLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    // Detect if we are in the login/signup pages to hide redundant button in navbar
    const isLoginPage = location.pathname == "/login";
    const isSignupPage = location.pathname == "/signup";

    return (
        <>
            <Navbar hideSignupButton={isLoginPage} hideLoginButton={isSignupPage}/>
            <div className="w-screen h-screen">
                {children}
            </div>
        </>
    )
}