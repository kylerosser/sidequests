import { useParams } from "react-router-dom"

export const QuestDetailsPanel = () => {
    const { id } = useParams();

    return (
        <div className="bg-white shadow-xl p-4 h-full pointer-events-auto overflow-y-auto">
            <h2 className="text-xl font-bold">{id}</h2>
        </div>
    )
}