import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { questsApi } from "../../api/questsApi";

import type { Quest } from '../../api/questsApi'

import { Hyperlink } from "../common/Hyperlink";
import { Spinner } from "../common/Spinner";
import { ReadMore } from "../common/ReadMore"
import { QuestChecklist } from "./QuestChecklist";
import { RecentActivity } from "./RecentActivity";

import closeButtonImage from '/close_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
import googleMapsImage from '/google_maps_icon.png';

import warningImage from '/warning_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';

export const QuestDetailsPanel = () => {
    const { id } = useParams();

    const [quest, setQuest] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        setQuest(null);
        if (!id) {
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
        <div className="pr-1 py-1 h-full ">
            <div className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-sq-grey scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <h2 className="text-xl font-bold mb-2 mr-4 sm:mr-0">{quest?.title}</h2>
                <div className="flex justify-between mb-3">
                    { /* TODO: href={`/users/${quest?.creator.id}`} */}
                    <p className="text-sm">Submitted by <Hyperlink href={""}>{quest?.creator.username}</Hyperlink></p>
                    
                </div>
                <ReadMore className="mb-3" collapsedHeight={68}>
                    <p className="text-sm">{quest?.description}</p>
                </ReadMore>
                <a className="inline-block mb-1" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${quest?.location.coordinates[1]},${quest?.location.coordinates[0]}`}>
                    <div className="flex items-center rounded-full border-1 border-sq-grey shadow-sm py-2 px-3">
                        <img className="h-5" src={googleMapsImage}></img><p className="ml-2 text-sm">Get Directions</p>
                    </div>
                </a>

                <hr className="border-sq-grey my-3"></hr>

                <QuestChecklist quest={quest as Quest} />

                <hr className="border-sq-grey my-3"></hr>

                <RecentActivity quest={quest as Quest} />

                <div className="flex mt-5">
                    <img className="h-8 mr-3" src={warningImage} />
                    <div>
                        <p className="text-xs">Quests are user-submitted. Sidequests does not endorse the accuracy, safety, or legality of any quest. Always exercise caution, use common sense, and follow local laws and safety guidelines when participating in any activity. You are responsible for your own safety and actions.</p>
                        {/* TODO: <Hyperlink className="text-xs mt-2" href="/make-a-complaint">Make a complaint</Hyperlink> */}
                    </div>
                   
                </div>
                
            </div>
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
        <div className="relative bg-white rounded-lg border-1 border-sq-grey shadow-md h-full w-full sm:w-lg pointer-events-auto">
            {/* Close Button */}
            <div className="absolute top-2 right-3.5 sm:top-0 sm:-right-9">
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