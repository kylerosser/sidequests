import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { routes } from '../../routing/routes'

import { Navbar } from '../common/Navbar'


export const PageLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    // Detect if we are in the login/signup pages to hide redundant button in navbar
    const isLoginPage = location.pathname == "/login";
    const isSignupPage = location.pathname == "/signup";

    // Dynamically update the page tab title
    useEffect(() => {
        const match = routes.find(r => r.path === location.pathname);
        if (match?.title) {
            document.title = `${match.title} - Sidequests`;
        } else {
            document.title = 'Page Not Found - Sidequests';
        }
    }, [location.pathname]);

    return (
        <>
            <Navbar hideSignupButton={isLoginPage} hideLoginButton={isSignupPage}/>
            <div className="h-screen overflow-x:hidden">
                {children}
            </div>
        </>
    )
}