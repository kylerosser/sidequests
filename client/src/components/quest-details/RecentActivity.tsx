import type { Quest } from '../../api/questsApi'
import type { Completion } from '../../api/completionsApi';
import { useState, useEffect, useCallback, useRef } from 'react'
import { completionsApi } from '../../api/completionsApi';

import { Spinner } from '../common/Spinner';
import { RecentActivityEntry } from './RecentActivityEntry';
import { Button } from '../common/Button';

type RecentActivityProps = {
    quest: Quest;
}

export const RecentActivity = ({ quest }: RecentActivityProps) => {
    const [loading, setLoading] = useState(true);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [completions, setCompletions] = useState<Completion[]>([]);
    const [noMoreCompletions, setNoMoreCompletions] = useState(false);

    const didRunRef = useRef(false);

    const loadMoreCompletions = useCallback(async (cursor: string | undefined, limit: number) => {
        const completionsResponse = await completionsApi.fetchCompletions(quest.id, undefined, cursor, limit);
        if (completionsResponse.success) {
            if (completionsResponse.data.length < limit) {
                setNoMoreCompletions(true);
            }
            const newCompletions = completionsResponse.data as Completion[]
            setCompletions(prev => [...prev, ...newCompletions]);
        } else {
            setNoMoreCompletions(true);
        }
        setLoading(false);
        setLoadMoreLoading(false);
    }, [quest.id])

    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;
        setCompletions([]);
        setNoMoreCompletions(false);
        setLoading(true);
        
        loadMoreCompletions(undefined, 3);
    }, [loadMoreCompletions])

    const loadMore = () => {
        setLoadMoreLoading(true);
        const oldestCompletion = completions.length !== 0 ? completions[completions.length - 1] : null
        loadMoreCompletions(oldestCompletion?.id, 5);
    }

    const loadedView = (<>
        {completions.length == 0 ?
            <p className="text-sm mb-4 italic">No one has completed this quest yet</p>
        :
            completions.map((completion) => {
                const completionTitle = quest.checkList[completion.checkListIndex].title;
                return <>
                    <RecentActivityEntry key={completion.id} title={completionTitle} completion={completion}/>
                    <hr className="border-sq-grey my-2"></hr>
                </>
            })
        }
        {completions.length !== 0 && !noMoreCompletions ? 
            <div className="flex justify-center mt-2">
                <Button loading={loadMoreLoading} onClick={loadMore} className="text-sm" variant="white">Load More</Button>
            </div>
        : null}
    </>)

    return (<>
        <p className="text-md font-bold mb-2">Recent Activity</p>
        {loading ? <Spinner/> : loadedView}
    </>)
}