
const steps = [
    {
        title: "Create your quest",
        subtitle: "Give it a title, description, location, and checklist."
    },
    {
        title: "Send it in",
        subtitle: "Hit submit and we'll take a quick look to make sure it fits the vibe."
    },
    {
        title: "Admire your contribution",
        subtitle: "Once our moderators approve it, your quest goes live for others to discover and complete."
    }
]

export const GetStartedStep = () => {
    return <>
        <h1 className="text-2xl font-bold">Submit a quest</h1>
        <p className="text-md mb-4">Got a spot worth sharing? Turn it into a Sidequest!</p>
        <div className="flex flex-col">
            {steps.map((step, index) => {
                return <div className="flex gap-4 mb-2">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-sq-primary font-bold text-2xl">
                        <span>{index + 1}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                        <h3 className="text-md">{step.subtitle}</h3>
                    </div>
                </div>
            })}
        </div>

        <h1 className="text-2xl font-bold mt-4 mb-1">Content guidelines</h1>
        <ul className="list-disc list-inside">
            <li>Only include places that are legally accessible to the public.</li>
            <li>Warn users about any natural hazards involved.</li>
            <li>Strictly no illegal activities, trespassing, or unsafe behaviour.</li>
            <li>Do not promote anything that might disturb wildlife, fragile ecosystems, or heritage sites.</li>
            <li>Do not promote the exploration of tunnels, caves, or mines, unless they are well-known and open to the public.</li>
            <li>Respect track closures, including tracks closed due to Kauri Dieback.</li>
        </ul>
    </>
}