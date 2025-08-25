import { useState } from "react"
import { GetStartedStep } from "../components/create-quest/GetStartedStep"
import { LocationStep } from "../components/create-quest/LocationStep"
import { PageLayout } from "../components/layouts/PageLayout"
import { Button } from "../components/common/Button";
import Stepper from "../components/common/Stepper";

export const CreateQuestPage = () => {
    const [step, setStep] = useState(0);

    const stepComponents = [
        <GetStartedStep />,
        <LocationStep />,
        <p>write details</p>,
        <p>review & submit</p>,
    ]

    const nextButtonClicked = () => {
        if (step == stepComponents.length - 1) {
            // Submit

            return;
        }
        setStep(step + 1);
    }

    const backButtonClicked = () => {
        setStep(step - 1);
    }

    return (<>
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 pt-4">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-2xl p-8">
                    <Stepper 
                        current = {step}
                        labels = {["Get started", "Location", "Details & Checklist", "Review & Submit"]}
                    />
                    <div className="mt-6">
                        {stepComponents[step]}
                    </div>
                    <div className={`flex ${step == 0 ? "justify-end" : "justify-between"} mt-4`}>
                        {step != 0 ? <Button onClick={backButtonClicked} variant="white" className="">Back</Button> : null}
                        <Button onClick={nextButtonClicked}>{step == 0 ? "Get started" : "Next"}</Button>
                    </div>
                    
                </div>
            </div>
        </PageLayout>
    </>)
}