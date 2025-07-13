import { QuestMap } from "../components/map/QuestMap"
import { ProfileMenu } from "../components/common/ProfileMenu"

export const QuestsPage = () => {
    return (
        <div className="relative">
            <QuestMap />
            {/* Top right corner */}
            <div className="absolute top-4 right-4 z-50">
                <ProfileMenu />
            </div>
        </div>
    )
}