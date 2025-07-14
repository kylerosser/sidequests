import { QuestMap } from "../components/map/QuestMap"
import { Navbar } from "../components/common/Navbar"

export const QuestsPage = () => {
    return (
        <div className="relative h-screen overflow-x:hidden">
            <QuestMap />
            <div className="absolute top-0 left-0 z-50">
                <Navbar />
            </div>
        </div>
    )
}