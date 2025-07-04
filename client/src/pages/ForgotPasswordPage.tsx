import { useState } from "react";

import { PageLayout } from '../components/layouts/PageLayout'
import { FormShortTextInput } from '../components/common/FormShortTextInput'
import { FormLabel } from '../components/common/FormLabel'
import { Button } from '../components/common/Button'

import { authApi } from '../api/authApi'

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false); // True if waiting for server respond to form submit

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitLoading) return;
        setSubmitLoading(true);

        const requestResponse = await authApi.requestPasswordResetEmail(email);
        setSubmitLoading(false);
        if (requestResponse.success) {
            setRequestSent(true);
        } else {
            if (typeof requestResponse.data == "string") {
                setError(requestResponse.data);
            } else {
                setError("An unknown error occurred.");
            }
        }
        
    };

    const formView = (<>
        <div className="mt-10 ">
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Forgot your password?</h2>
            <p className="mt-1 text-center text-lg">Enter your email and we will send you a password reset link.</p>
        </div>

        <div className="mb-10 mx-auto w-full max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <FormLabel htmlFor="email" text="Email" />
                    <FormShortTextInput value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" type="text" name="email" id="email" autoComplete="email" required />
                </div>

                <div className="text-center">
                    <Button className="w-full" loading={submitLoading} type="submit" variant='primary'>Reset Password</Button>
                    <span className={`text-sq-red text-sm/6 font-medium ${error ? "" : "hidden"}`}>{error}</span>
                </div>
            </form>
        </div>
    </>)

    const requestSentView = (
        <p className="my-10 text-center text-md">Password reset link sent! Check your email inbox.</p>
    )

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    {requestSent ? requestSentView : formView}
                </div>
            </div>
        </PageLayout>
    )
}