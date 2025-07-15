import { Outlet } from "react-router-dom"
import { QuestMap } from "../components/map/QuestMap"
import { Navbar } from "../components/common/Navbar"

import { SetPageTitle } from "../components/common/SetPageTitle"

export const QuestsPage = () => {
    return (<>
        <SetPageTitle />
        <div className="relative h-screen overflow-x:hidden">
            <QuestMap />
            <div className="absolute top-0 left-0 z-50">
                <Navbar />
            </div>

            {/* Render QuestDetailsPanel if we are in the quests/:id subroute */}
            <div className="absolute top-15 left-0 z-40 pointer-events-none">
                <Outlet />
            </div>
        </div>
    </>)
}