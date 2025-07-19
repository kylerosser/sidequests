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
            return;
        }
        setLoading(true);
        // Todo: fetch from GET api/auth/completions?quest=quest.id&?userId=user.id
        // Dummy data for now:
        setCompletionIndices([1]);
        setLoading(false);
    }

    useEffect(refreshChecklist, [user]);

    const questProgressBar = (
        <></>
    )

    const loadingView = (
        <Spinner />
    )

    const loadedView = (<>
        {user ? questProgressBar : <p className="text-sm italic">Log in to view your progress for this quest</p> }
        {quest?.checkList.map((_, index) => {
            const uniqueKey = quest.id + index.toString();
            return <QuestChecklistItem key={uniqueKey} quest={quest} itemIndex={index} completionIndices={completionIndices}/>
        })}
    </>)

    return (<>
        <p className="text-md font-bold">Quest Checklist</p>
        {loading ? loadingView : loadedView}
    </>)
}