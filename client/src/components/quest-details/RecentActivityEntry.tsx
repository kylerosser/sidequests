import type { Completion } from "../../api/completionsApi"

import { Hyperlink } from '../common/Hyperlink';

type RecentActivityEntryProps = {
    completion: Completion;
    title: string;
}

export const RecentActivityEntry = ({ completion, title }: RecentActivityEntryProps) => {
    const date = new Date(completion.createdAt);
    const formattedDate = date.toLocaleString(undefined, {
        dateStyle: "medium",   // "short", "medium", "long", or "full"
        timeStyle: "short",    // can also use "medium", "long", etc.
     });
    return (<>
        <p className="text-xs"><Hyperlink href={`/users/${completion.completer.id}`}>{completion.completer.username}</Hyperlink> completed <span className="font-bold">{`"${title}"`}</span></p>
        <p className="text-xs">{formattedDate}</p>
        <p className="text-xs italic mt-2">{completion.comment}</p>
    </>)
}