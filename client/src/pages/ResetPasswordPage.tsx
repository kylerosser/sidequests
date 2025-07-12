import { useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom"

import { PageLayout } from '../components/layouts/PageLayout'
import { FormShortTextInput } from '../components/common/FormShortTextInput'
import { FormLabel } from '../components/common/FormLabel'
import { Button } from '../components/common/Button'

import { authApi } from '../api/authApi'

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    // If a token is provided as a search param, the reset password page will display a form for
    // resetting the users password, otherwise it will redirect to the forgot password page
    const token = searchParams.get("token");
    
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [error, setError] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false); // True if waiting for server respond to form submit

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitLoading) return;
        setSubmitLoading(true);

        if (password != confirmedPassword) {
            setError("Password confirmation does not match the password");
            setPassword("");
            setConfirmedPassword("");
            setSubmitLoading(false);
            return;
        }

        const requestResponse = await authApi.resetPassword(token as string, password);
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
        setPassword("");
        setConfirmedPassword("");
    };

    const formView = (<>
        <div className="mt-10 mb-5">
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Reset your password</h2>
            <p className="mt-1 text-center text-lg">Please enter a new password below.</p>
        </div>

        <div className="mb-10 mx-auto w-full max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <FormLabel htmlFor="password" text="Password" />
                    <FormShortTextInput value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" type="password" name="password" id="password" autoComplete="new-password" required />
                </div>

                <div>
                    <FormLabel htmlFor="confirmedPassword" text="Confirm your password" />
                    <FormShortTextInput value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} className="mt-2" type="password" name="confirmedPassword" id="confirmedPassword" autoComplete="new-password" required />
                </div>

                <div className="text-center">
                    <Button className="w-full" loading={submitLoading} type="submit" variant='primary'>Set Password</Button>
                    <span className={`text-sq-red text-sm/6 font-medium ${error ? "" : "hidden"}`}>{error}</span>
                </div>
            </form>
        </div>
    </>)

    const redirectView = (
        <Navigate to="/forgot-password"/>
    )

    const requestSentView = (<>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Password Reset</h2>
        <p className="mt-1 text-center text-md">You are now ready to log in to your account!</p>
        <div className="mt-6 flex flex-col items-center">
            <Link to="/login"><Button>Log in</Button></Link>
        </div>
    </>)

    let chosenView;
    if (requestSent) {
        chosenView = requestSentView;
    } else if (!token) {
        chosenView = redirectView;
    } else {
        chosenView = formView;
    }

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    <div className="my-10">
                        {chosenView}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}