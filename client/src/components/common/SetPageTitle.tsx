import { useEffect } from "react";
import { routes } from '../../routing/routes'
import { useLocation } from "react-router-dom";

export const SetPageTitle = () => {
    const location = useLocation();
    
    // Dynamically update the page tab title
    useEffect(() => {
        const match = routes.find(r => r.path === location.pathname);
        if (match?.title) {
            document.title = `${match.title} - Sidequests`;
        } else {
            document.title = 'Page Not Found - Sidequests';
        }
    }, [location.pathname]);
    return (<></>)
}