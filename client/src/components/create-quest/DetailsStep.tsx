import { useState } from "react"
import { FormLabel } from "../common/FormLabel"
import { FormLongTextInput } from "../common/FormLongTextInput";

export const DetailsStep = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return <div>
        <h1 className="text-2xl font-bold">Describe your quest in detail</h1>
        <p className="mt-2 mb-3">Think of a catchy title for your Sidequest, along with a detailed description, including as much information as possible. Describe where the quest is, why it's awesome, how to get to the quest, any equipment needed, tips & tricks, parking, and safety info. Warn users about any potential hazards.</p>
        <FormLabel htmlFor="title" text="Title (start your title with a verb)" />
        <FormLongTextInput
        autoComplete="off"
        name="title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Climb the giant sand dunes near Bethells Beach"
        className="mb-4"
        maxCharacters={100}
        minHeight={36}
        />
        <FormLabel htmlFor="description" text="Description" />
        <FormLongTextInput
        autoComplete="off"
        name="title"
        id="title"
        maxCharacters={800}
        minHeight={120}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
        placeholder="e.g. Venture out to the sand dunes near Te Henga (Bethells Beach) and experience a unique slice of nature on the West Coast of Auckland. Be respectful of the surrounding land: some areas are private property, but much of the dunes are open to the public. To get to the dunes, follow the stream near the small carpark."
        />
    </div>
}