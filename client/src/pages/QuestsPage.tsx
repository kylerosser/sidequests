import { Outlet, useParams } from "react-router-dom"
import { QuestMap } from "../components/map/QuestMap"
import { Navbar } from "../components/common/Navbar"
import { SetPageTitle } from "../components/common/SetPageTitle"
import { MapRefProvider } from "../hooks/useMapRef/MapRefProvider"
import { SearchBar } from "../components/map/SearchBar"

export const QuestsPage = () => {
    const { id } = useParams();
    const isBaseQuestRoute = !id

    return (<>
        <SetPageTitle />
        <MapRefProvider>
            <div className="relative h-dvh overflow-x:hidden">
                <QuestMap />
                <div className="absolute top-0 left-0">
                    <Navbar />
                </div>

                {/* Render QuestDetailsPanel if we are in the quests/:id subroute */}
                <div className="absolute top-[60px] left-0 z-40 pointer-events-none h-[calc(100%-60px)] w-full p-4">
                    {isBaseQuestRoute && <SearchBar/>}
                    <Outlet />
                </div>
            </div>
        </MapRefProvider>
    </>)
}