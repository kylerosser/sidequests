import type { QuestData } from "../../pages/CreateQuestPage";
import { DifficultyBadge } from "../quest-details/DifficultyBadge";
import googleMapsImage from '/google_maps_icon.png';

export const ReviewStep = ({ questData }: {questData: QuestData}) => {
    return <div>
        <h1 className="text-2xl font-bold">You're almost done!</h1>
        <p className="mt-2 mb-3">Read over your submission and check for any errors. Once you are happy with it, press submit, and our moderators will take a look.</p>
        
        <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full px-4 py-3">
            <p className="text-lg font-bold mb-1">{questData.title != "" ? questData.title : "(title empty)"}</p>
            <p className="text-sm">{questData.description != "" ? questData.description : "(description empty)"}</p>
            {questData.coordinates.lat != null && questData.coordinates.lng != null ? 
                <>
                    <a className="inline-block mt-2" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${questData.coordinates.lat},${questData.coordinates.lng}`}>
                        <div className="flex items-center rounded-full border-1 border-sq-grey shadow-sm py-2 px-3">
                            <img className="h-5" src={googleMapsImage}></img>
                            <p className="ml-2 text-sm">{`${questData.coordinates.lat}, ${questData.coordinates.lng}`}</p>
                        </div>
                    </a>
                    <p className="text-xs mt-1">Note: Google Maps may not display the coordinates as precisely as the Sidequests quest map.</p>
                </>
            : <p className="text-sm mt-1">(location missing)</p>}
            
            <hr className="border-sq-grey my-3"></hr>
            <p className="text-lg font-bold mb-1">Quest Checklist</p>
            {questData.checkList.map((item) => {
                return <>
                    <p className="text-sm font-bold">{item.title != "" ? item.title : "(title empty)"}</p>
                    <DifficultyBadge difficulty={item.difficulty} />
                    <p className="text-sm mb-2 mt-1">{item.description != "" ? item.description : "(description empty)"}</p>
                </>
            })}
        </div>
        
    </div>
}