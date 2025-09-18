import { useState } from "react"
import { FormLabel } from "../common/FormLabel"
import { FormLongTextInput } from "../common/FormLongTextInput";

export const DetailsStep = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return <div>
        <FormLabel htmlFor="title" text="Enter a short title (your title should start with a verb)" />
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
        <FormLabel htmlFor="description" text="Enter a description for your quest (include as much information as possible)" />
        <FormLongTextInput
        autoComplete="off"
        name="title"
        id="title"
        maxCharacters={600}
        minHeight={120}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
        placeholder="e.g. Venture out to the sand dunes near Te Henga (Bethells Beach) and experience a unique slice of nature on the West Coast of Auckland. Be respectful of the surrounding land: some areas are private property, but much of the dunes are open to the public."
        />

    </div>
}