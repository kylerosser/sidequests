import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router"
import { useAuth } from "../auth/useAuth";

import { PageLayout } from '../components/layouts/PageLayout'
import { FormShortTextInput } from '../components/common/FormShortTextInput'
import { FormLabel } from '../components/common/FormLabel'
import { Hyperlink } from '../components/common/Hyperlink'
import { Button } from '../components/common/Button'

import signInWithGoogleImage from '/google_login_SI.svg';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect')
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loginResponse = await login(identifier, password);
        if (loginResponse.success) {
            // Login success, redirect to route specified in query params or /quests as fallback
            navigate(redirect ? redirect : "/quests");
        } else {
            console.log(loginResponse);
            if (typeof loginResponse.data == "string") {
                setError(loginResponse.data);
            } else {
                setError("An error occured while trying to log you in");
            }
        }
    };

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    <div className="mt-10 ">
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Adventure awaits...</h2>
                        <p className="mt-1 text-center text-lg">Log in to your account to continue</p>
                    </div>

                    <div className="mt-10 mx-auto w-full max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <FormLabel htmlFor="email" text="Username or Email" />
                                <FormShortTextInput value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-2" type="text" name="email" id="email" autoComplete="email" required />
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <FormLabel htmlFor="password" text="Password" />
                                    <Hyperlink className="text-sm" href="/forgot-password">Forgot password?</Hyperlink>
                                </div>
                                <FormShortTextInput value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" type="password" name="password" id="password" autoComplete="current-password" required />
                            </div>
                            <div className="text-center">
                                <Button type="submit" variant='primary'>Log in</Button>
                                <span className={`text-sq-red text-sm/6 font-medium ${error ? "" : "hidden"}`}>{error}</span>
                            </div>
                        </form>
                        <div>
                            <div className="flex items-center gap-4 my-5">
                                <hr className="flex-grow border-t border-sq-grey" />
                                <span className="text-gray-500 text-sm">OR</span>
                                <hr className="flex-grow border-t border-sq-grey" />
                            </div>
                        </div>

                        <div className="flex">
                            <button className="mx-auto cursor-pointer"><img src={signInWithGoogleImage}/></button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-8 mt-5 block font-medium text-center text-sm/6">New to Sidequests? <Hyperlink href="/signup">Create an account</Hyperlink></p>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}