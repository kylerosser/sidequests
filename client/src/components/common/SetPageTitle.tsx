import { useEffect } from "react";
import { routes } from '../../routing/routes'
import { useLocation } from "react-router-dom";

export const SetPageTitle = () => {
    const location = useLocation();
    
    // Dynamically update the page tab title to match the title provided in routes.tsx
    useEffect(() => {
        const match = routes.find(r => r.path === location.pathname);
        if (match?.title) {
            document.title = `${match.title} - Sidequests`;
        } else if (location.pathname.includes('quests/')) { // In case we are in /quests/:id (title is set by QuestDetailsPanel)
            document.title = 'Loading... - Sidequests';
        } else {
            document.title = 'Page Not Found - Sidequests';
        }
    }, [location.pathname]);
    return (<></>)
}