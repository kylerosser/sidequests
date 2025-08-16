import { PageLayout } from "../components/layouts/PageLayout"

export const CreateQuestPage = () => {
    return (<>
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-2xl p-8">
                    <div className="">
                        {/* make a component for each step of the process with next buttons */}
                        <h1 className="text-2xl font-bold">Submit a quest</h1>
                        <p className="text-md mb-4">Got a spot worth sharing? Turn it into a Sidequest.</p>
                        <div className="flex flex-col">
                            <div className="flex gap-4 mb-2">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-sq-primary font-bold text-2xl">
                                    <span>1</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Create your quest</h3>
                                    <h3 className="text-md">Give it a title, description, location, and checklist.</h3>
                                </div>
                            </div>
                            <div className="flex gap-4 mb-2">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-sq-primary font-bold text-2xl">
                                    <span>2</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Send it in</h3>
                                    <h3 className="text-md">Hit submit and we'll take a quick look to make sure it fits the vibe.</h3>
                                </div>
                            </div>
                            <div className="flex gap-4 mb-2">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-sq-primary font-bold text-2xl">
                                    <span>3</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Admire your contribution</h3>
                                    <h3 className="text-md">Once our moderators approve it, your quest goes live for others to discover and complete.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </PageLayout>
    </>)
}