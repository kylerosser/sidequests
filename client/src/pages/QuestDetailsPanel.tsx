import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { questsApi } from "../api/questsApi";

import type { Quest } from '../api/questsApi'

import { Hyperlink } from "../components/common/Hyperlink";
import { Spinner } from "../components/common/Spinner";

import closeButtonImage from '/close_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';

export const QuestDetailsPanel = () => {
    const { id } = useParams();

    const [quest, setQuest] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (!id) {
            setQuest(null);
            setError(true);
            document.title = "Quest Not Found - Sidequests";
            return;
        }
        (async () => {
            const requestResponse = await questsApi.fetchQuestById(id);
            if (requestResponse.success) {
                setQuest(requestResponse.data as Quest);
                setLoading(false);
                // Set the title of the browser tab with truncation if too long
                const title = (requestResponse.data as Quest).title;
                const truncatedTitle = title.length > 50 ? title.slice(0, 50 - 3) + '...' : title
                document.title = `${truncatedTitle} - Sidequests`;
            } else {
                setQuest(null);
                setError(true);
                document.title = "Quest Not Found - Sidequests";
            }
        })();
    }, [id]);

    const loadedView = (<>
        <div className="p-6">
            <h2 className="text-xl font-bold mb-1 mr-4">{quest?.title}</h2>
            <p className="mb-4 text-sm">Submitted by <Hyperlink href={`/users/${quest?.creator.id}`}>{quest?.creator.username}</Hyperlink></p>
            <p className="mb-4 text-sm">{quest?.description}</p>
        </div>
    </>)

    const loadingView = (<>
        <div className="flex justify-center items-center h-full">
            <Spinner />
        </div>
    </>)

    const failedView = (
        <div className="flex justify-center items-center h-full">
            <p className="mt-1 text-center text-md">Error: Quest not found</p>
        </div>
    )

    let shownView = loadedView;
    if (error) {
        shownView = failedView;
    } else if (loading) {
        shownView = loadingView;
    }

    return (
        <div className="relative bg-white rounded-lg border-1 border-sq-grey shadow-md h-full w-full sm:w-md pointer-events-auto">
            {/* Close Button */}
            <div className="absolute top-2 right-2">
                <Link to="/quests">
                    <div className="bg-white rounded-full border-1 border-sq-grey w-8 h-8 flex items-center justify-center">
                        <img src={closeButtonImage}/>
                    </div>
                </Link>
            </div>
        
            {shownView}
        </div>
    )
}