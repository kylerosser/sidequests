import { FormLabel } from "../common/FormLabel"
import { FormLongTextInput } from "../common/FormLongTextInput"
import { DifficultyBadge } from "../quest-details/DifficultyBadge"
import type { QuestData } from "../../pages/CreateQuestPage"
import deleteImage from '/delete_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg'
import { Button } from "../common/Button"

const difficultyInfo = [
    { id: 1, description: "Typically completed in under 10 minutes. Single-step objective with an obvious solution and no preparation or equipment required." },
    { id: 2, description: "Typically completed in 15–45 minutes. May involve multiple steps, light problem-solving, or searching, but no specialist skills or equipment." },
    { id: 3, description: "Typically completed in 1–3 hours. Involves several non-obvious steps, sustained physical or mental effort, or benefits from basic preparation or equipment." },
    { id: 4, description: "Typically completed in 3+ hours or across multiple sessions. Requires advanced skills, precise execution, or specialist equipment." }
] as const

export const CheckListItem = ({ itemNumber, itemData, setItemData, deleteItemData, showDeleteButton }: { itemNumber: number, itemData: QuestData["checkList"][number], setItemData: (data: QuestData["checkList"][number]) => void, deleteItemData: () => void, showDeleteButton: boolean  }) => {
    const setTitle = (newTitle: string) => setItemData({...itemData, title: newTitle})
    const setDescription = (newDescription: string) => setItemData({...itemData, description: newDescription})
    const setDifficulty = (newDifficulty: 1 | 2 | 3 | 4) => setItemData({...itemData, difficulty: newDifficulty})

    return <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full px-4 py-3 mb-3">
        <div className="relative">
            <h1 className="font-bold mb-1">{`Activity #${itemNumber}`}</h1>
            {showDeleteButton ? 
                <Button onClick={deleteItemData} className="absolute top-0 right-0 text-sm flex items-center justify-center" variant="white">
                    <img src={deleteImage} className="h-6 select-none" alt="Delete"/>
                </Button>
            : null}
        </div>
        
        <FormLabel htmlFor={`checkList${itemData.id}Title`} text="Title (must start with a verb)" />
        <FormLongTextInput
        autoComplete="off"
        name={`checkList${itemData.id}Title`}
        id={`checkList${itemData.id}Title`}
        maxCharacters={100}
        minHeight={36}
        value={itemData.title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
        placeholder="e.g. Reach the sand dunes and enjoy the stunning scenery"
        />

        <FormLabel htmlFor={`checkList${itemData.id}Description`} text="Description" className="mt-2"/>
        <FormLongTextInput
        autoComplete="off"
        name={`checkList${itemData.id}Description`}
        id={`checkList${itemData.id}Description`}
        maxCharacters={800}
        minHeight={80}
        value={itemData.description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
        placeholder="e.g. Park at the Lake Wainamu Car Park signage and follow the stream inland. Stick to the riverside track and avoid crossing onto private land. Once you reach the dunes, take in the sweeping views."
        />

        <FormLabel htmlFor={`checkList${itemData.id}Difficulty`} text="Difficulty" />
        <form
        name={`checkList${itemData.id}Difficulty`}
        id={`checkList${itemData.id}Difficulty`}
        >
        {difficultyInfo.map((difficultyEntry) => {
            const inputId = `difficulty-${difficultyEntry.id}-${itemData.id}`;

            return (
            <label
                key={inputId}
                htmlFor={inputId}
                className="flex items-start gap-2 cursor-pointer mb-2"
            >
                <input
                type="radio"
                id={inputId}
                name={`checkList${itemData.id}Difficulty`}
                value={difficultyEntry.id}
                checked={itemData.difficulty === difficultyEntry.id}
                onChange={() => setDifficulty(difficultyEntry.id)}
                className="mt-1 shrink-0"
                />

                <div className="flex flex-row gap-2 items-start">
                    <DifficultyBadge className="mt-1" difficulty={difficultyEntry.id} />

                    <p className="text-xs inline">
                    {difficultyEntry.description}
                    </p>
                </div>
            </label>
            );
        })}
        </form>

    </div>
}