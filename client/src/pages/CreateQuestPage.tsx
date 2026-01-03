import { useState } from "react"
import { v4 as uuidv4 } from "uuid";
import { GetStartedStep } from "../components/create-quest/GetStartedStep"
import { LocationStep } from "../components/create-quest/LocationStep"
import { PageLayout } from "../components/layouts/PageLayout"
import { Button } from "../components/common/Button";
import Stepper from "../components/common/Stepper";
import { DetailsStep } from "../components/create-quest/DetailsStep";
import { CheckListStep } from "../components/create-quest/CheckListStep";
import { ReviewStep } from "../components/create-quest/ReviewStep";
import { Hyperlink } from "../components/common/Hyperlink";

export interface QuestData {
    title: string,
    description: string,
    coordinates: { lat: number | null, lng: number | null },
    checkList: { id: string, title: string, description: string, difficulty: 1 | 2 | 3 | 4 }[]
}

export const CreateQuestPage = () => {
    const [step, setStep] = useState(0);
    const [questData, setQuestData] = useState<QuestData>({
        title: "",
        description: "",
        coordinates: { lat: null, lng: null },
        checkList: [{id: uuidv4(), title: "", description: "", difficulty: 1}]
    });
    const [submitted, setSubmitted] = useState(false)

    const stepComponents = [
        <GetStartedStep />,
        <LocationStep questData={questData} setQuestData={setQuestData}/>,
        <DetailsStep questData={questData} setQuestData={setQuestData}/>,
        <CheckListStep questData={questData} setQuestData={setQuestData}/>,
        <ReviewStep questData={questData} />,
    ]

    const nextButtonClicked = () => {
        if (step == stepComponents.length - 1) {
            setSubmitted(true);

            return;
        }
        setStep(step + 1);
    }

    const backButtonClicked = () => {
        setStep(step - 1);
    }

    if (submitted) return <PageLayout>
        <div className="flex min-h-full flex-col justify-center px-4 pt-4">
            <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-2xl p-8">
                <h1 className="text-2xl font-bold">Quest Submitted!</h1>
                <p className="mt-2 mb-2">Once our moderators approve it, your quest will go live for others to discover and complete.</p>
                <Hyperlink href="/quests">Back to Quest Map</Hyperlink>
            </div>
        </div>
    </PageLayout>

    return (<>
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 pt-4">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-2xl p-8">
                    <Stepper 
                        current = {step}
                        labels = {["Get started", "Location", "Details", "Checklist", "Review & Submit"]}
                    />
                    <div className="mt-6">
                        {stepComponents[step]}
                    </div>
                    <div className={`flex ${step == 0 ? "justify-end" : "justify-between"} mt-4`}>
                        {step != 0 ? <Button onClick={backButtonClicked} variant="white" className="">Back</Button> : null}
                        <Button onClick={nextButtonClicked}>{step == 0 ? "Get started" : (step == stepComponents.length-1 ? "Submit" : "Next")}</Button>
                    </div>
                    
                </div>
            </div>
        </PageLayout>
    </>)
}