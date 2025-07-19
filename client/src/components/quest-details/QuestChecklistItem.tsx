import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import type { Quest } from '../../api/questsApi'
import { completionsApi } from '../../api/completionsApi';

import { DifficultyBadge } from "./DifficultyBadge";
import { ReadMore } from "../common/ReadMore"
import { FormLongTextInput } from '../../components/common/FormLongTextInput'
import { Button } from '../../components/common/Button'

import checkedBoxImage from '/check_box_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';
import uncheckedBoxImage from '/check_box_outline_blank_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg';

type QuestChecklistItemProps = {
    completionIndices: number[];
    setCompletionIndices: React.Dispatch<React.SetStateAction<number[]>>;
    quest: Quest;
    itemIndex: number;
    loggedIn: boolean;
}

export const QuestChecklistItem = ({ quest, itemIndex, completionIndices, setCompletionIndices, loggedIn }: QuestChecklistItemProps) => {
    const navigate = useNavigate();

    const checkListItem = quest.checkList[itemIndex];
    const completed = completionIndices.includes(itemIndex);

    const [showCompleteView, setShowCompleteView] = useState(false);
    const [logCompletionLoading, setlogCompletionLoading] = useState(false);
    const [comment, setComment] = useState("");

    const onCheckBoxClick = () => {
        if (completed) return;
        setShowCompleteView(true);
    }
    
    const handleCompleteFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedIn) {
            navigate('/login?redirect=/quests/' + quest.id);
            return;
        }
        if (logCompletionLoading) return;
        setlogCompletionLoading(true);
        (async () => {
            const logCompletionResponse = await completionsApi.logNewCompletion(quest.id, comment, itemIndex);
            if (logCompletionResponse.success) {
                setShowCompleteView(false);
                setCompletionIndices([...completionIndices, itemIndex]);
            }
            setlogCompletionLoading(false);
        })()
    }

    const completeView = <>
        <form className="space-y-2 mb-3" onSubmit={handleCompleteFormSubmit}>
            <FormLongTextInput maxCharacters={1000} value={comment} onChange={(e) => setComment(e.target.value)} className="mt-2" name="comment" id="comment" placeholder="Write a comment about your experience (optional)" />
            <div className="flex">
                <Button loading={logCompletionLoading} type="submit" variant='primary'>Mark as complete</Button>
                <Button className="ml-2" variant='white' onClick={() => setShowCompleteView(false)}>Cancel</Button>
            </div>
        </form>
    </>
    return (
        
        <div className="flex mt-2">
            {completed ? 
            <img src={checkedBoxImage} className={"mr-3 w-8 h-8"}/>
            :
            <div
            className={"mr-3 w-8 h-8 relative shrink-0 group cursor-pointer"}
            onClick={onCheckBoxClick}
            >
                <img src={uncheckedBoxImage} className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-0"/>
                <img src={checkedBoxImage} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100"/>
            </div>
            }
            
            <div>
                <p className="text-sm font-bold">{checkListItem.title}</p>
                <DifficultyBadge difficulty={checkListItem.difficulty as 1|2|3|4}/>
                <ReadMore collapsedHeight={0} gradient={false} readMoreText={"See details"} showLessText={"Hide details"}>
                    <p className="text-sm mt-1">{checkListItem.description}</p>
                </ReadMore>
                {showCompleteView ? completeView : null}
            </div>
        </div>
    )
        
}