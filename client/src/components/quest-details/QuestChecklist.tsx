import type { Quest } from '../../api/questsApi'

import { DifficultyBadge } from "./DifficultyBadge";
import { ReadMore } from "../common/ReadMore"

import checkedBoxImage from '/check_box_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
import uncheckedBoxImage from '/check_box_outline_blank_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';

type QuestChecklistProps = {
    quest: Quest;
}

export const QuestChecklist = ({ quest }: QuestChecklistProps) => {
    return (<>
        <p className="text-md font-bold">Quest Checklist</p>
        {quest?.checkList.map((checkListItem) => (
            <div className="flex mt-2" key={checkListItem.title}>
                <img className="mr-3 h-8 cursor-pointer" src={uncheckedBoxImage}/>
                <div>
                    <p className="text-sm font-bold">{checkListItem.title}</p>
                    <DifficultyBadge difficulty={checkListItem.difficulty as 1|2|3|4}/>
                    <ReadMore collapsedHeight={0} gradient={false} readMoreText={"See details"} showLessText={"Hide details"}>
                        <p className="text-sm mt-1">{checkListItem.description}</p>
                    </ReadMore>
                </div>
            </div>
        ))}
    </>)
}