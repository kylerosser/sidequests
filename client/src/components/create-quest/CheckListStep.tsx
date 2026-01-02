
import { CheckListItem } from "./CheckListItem";

export const CheckListStep = () => {

    return <div>
        <h1 className="text-2xl font-bold">Create a checklist</h1>
        <p className="mt-2 mb-3">Each quest has a checklist of activities to complete. You must have at least one activity. Each activity should have a short title and description explaining how to complete it.</p>
        <CheckListItem itemNumber={1}/>
    </div>
}