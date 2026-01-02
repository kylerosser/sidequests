import { useState } from "react"
import { FormLabel } from "../common/FormLabel"
import { FormLongTextInput } from "../common/FormLongTextInput"
import { DifficultyBadge } from "../quest-details/DifficultyBadge"

const difficultyInfo = [
    { id: 1, description: "Typically completed in under 10 minutes. Single-step objective with an obvious solution and no preparation or equipment required." },
    { id: 2, description: "Typically completed in 15–45 minutes. May involve multiple steps, light problem-solving, or searching, but no specialist skills or equipment." },
    { id: 3, description: "Typically completed in 1–3 hours. Involves several non-obvious steps, sustained physical or mental effort, or benefits from basic preparation or equipment." },
    { id: 4, description: "Typically completed in 3+ hours or across multiple sessions. Requires advanced skills, precise execution, or specialist equipment." }
] as const

export const CheckListItem = ({ itemNumber }: { itemNumber: number }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [difficulty, setDifficulty] = useState(1)

    return <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full px-4 py-3">
        <h1 className="font-bold mb-1">{`Activity #${itemNumber}`}</h1>
        <FormLabel htmlFor={`checkList${itemNumber}Title`} text="Title (must start with a verb)" />
        <FormLongTextInput
        autoComplete="off"
        name={`checkList${itemNumber}Title`}
        id={`checkList${itemNumber}Title`}
        maxCharacters={100}
        minHeight={36}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
        placeholder="e.g. Reach the sand dunes and enjoy the stunning scenery"
        />

        <FormLabel htmlFor={`checkList${itemNumber}Description`} text="Description" className="mt-2"/>
        <FormLongTextInput
        autoComplete="off"
        name={`checkList${itemNumber}Description`}
        id={`checkList${itemNumber}Description`}
        maxCharacters={800}
        minHeight={80}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
        placeholder="e.g. Park at the Lake Wainamu Car Park signage and follow the stream inland. Stick to the riverside track and avoid crossing onto private land. Once you reach the dunes, take in the sweeping views."
        />

        <FormLabel htmlFor={`checkList${itemNumber}Difficulty`} text="Difficulty" />
        <form
        name={`checkList${itemNumber}Difficulty`}
        id={`checkList${itemNumber}Difficulty`}
        >
        {difficultyInfo.map((difficultyEntry) => {
            const inputId = `difficulty-${difficultyEntry.id}`;

            return (
            <label
                key={inputId}
                htmlFor={inputId}
                className="flex items-start gap-2 cursor-pointer mb-2"
            >
                <input
                type="radio"
                id={inputId}
                name={`checkList${itemNumber}Difficulty`}
                value={difficultyEntry.id}
                checked={difficulty === difficultyEntry.id}
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