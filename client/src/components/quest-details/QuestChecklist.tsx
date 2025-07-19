import { useState, useEffect } from 'react';
import type { Quest } from '../../api/questsApi'
import { useAuth } from "../../auth/useAuth";

import { Spinner } from "../common/Spinner";
import { QuestChecklistItem } from './QuestChecklistItem';

type QuestChecklistProps = {
    quest: Quest;
}

export const QuestChecklist = ({ quest }: QuestChecklistProps) => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [completionIndices, setCompletionIndices] = useState<number[]>([]);

    const refreshChecklist = () => {
        if (!user) {
            setLoading(false);
            setCompletionIndices([]);
            return;
        }
        setLoading(true);
        // Todo: fetch from GET api/auth/completions?quest=quest.id&?userId=user.id
        // Dummy data for now:
        setCompletionIndices([1,0]);
        setLoading(false);
    }

    useEffect(refreshChecklist, [user]);

    const numberOfItems = quest.checkList.length;
    const numberOfCompletedItems = completionIndices.length;
    
    const progressBarPercent = Math.round(numberOfCompletedItems/numberOfItems * 100);
    const questProgressBar = (
        <div className="flex items-center">
            <div className="bg-sq-grey rounded-full flex-grow h-3">
                <div className="h-full bg-sq-primary rounded-full" style={{width: `${progressBarPercent}%`}}/>
            </div>
            <p className="text-sm ml-3">{progressBarPercent}% Complete</p>
        </div>
    )

    const loadingView = (
        <Spinner />
    )

    const loadedView = (<>
        {user ? questProgressBar : <p className="text-sm italic">Log in to view your progress for this quest</p> }
        {quest?.checkList.map((_, index) => {
            const uniqueKey = quest.id + index.toString();
            return <QuestChecklistItem loggedIn={user != null} key={uniqueKey} quest={quest} itemIndex={index} completionIndices={completionIndices}/>
        })}
    </>)

    return (<>
        <p className="text-md font-bold">Quest Checklist</p>
        {loading ? loadingView : loadedView}
    </>)
}