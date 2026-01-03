import { v4 as uuidv4 } from "uuid";
import type { QuestData } from "../../pages/CreateQuestPage";
import { Button } from "../common/Button";
import { CheckListItem } from "./CheckListItem";

import plusImage from '/add_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
const MAX_CHECKLIST_ITEMS = 5;

export const CheckListStep = ({ questData, setQuestData }: { questData: QuestData, setQuestData: React.Dispatch<React.SetStateAction<QuestData>> }) => {

    return <div>
        <h1 className="text-2xl font-bold">Create a checklist</h1>
        <p className="mt-2 mb-3">Each quest has a checklist of activities to complete. You must have at least one activity. Each activity should have a short title and description explaining how to complete it.</p>
        
        {questData.checkList.map((itemData, itemIndex) => {
            const setItemData = (newItemData: QuestData["checkList"][number]) => {
                setQuestData((prev) => {
                    return {
                        ...prev, 
                        checkList: prev.checkList.map((prevItem, prevItemIndex) => 
                            prevItemIndex == itemIndex ? newItemData : prevItem
                        )
                    }
                })
            }

            const deleteItemData = () => {
                setQuestData((prev) => {
                    return {...prev, checkList: prev.checkList.filter((thisItemData) => thisItemData.id != itemData.id)}
                })
            }

            return <CheckListItem 
                itemNumber={itemIndex + 1} 
                itemData={itemData} 
                setItemData={setItemData} 
                deleteItemData={deleteItemData}
                showDeleteButton={questData.checkList.length > 1}
                key={`checkListItem${itemIndex + 1}`}
            />
        })}

        {questData.checkList.length < MAX_CHECKLIST_ITEMS ?
            <div className="flex justify-center">
                <Button 
                    onClick={() => setQuestData(
                        (prev) => { 
                            return {
                                ...prev,
                                checkList: [...prev.checkList, {id: uuidv4(), title: "", description: "", difficulty: 1}]
                            } 
                        }
                    )} 
                    className="text-sm flex items-center justify-center" variant="white"
                >
                    <img src={plusImage} className="h-5 mr-2 select-none" alt="Add"/>
                    <span>Add another activity</span>
                </Button>
            </div>
        : null}
        
    </div>
}