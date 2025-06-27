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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            // If a redirect is provided as a query param, redirect there after logging in
            if (redirect) {
                navigate(redirect);
            } else {
                // Fallback to the quests page if no redirect specified
                navigate('/quests');
            }
            
        } catch {
            alert("Login failed"); // todo: improve with a popup or something
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
                                <FormShortTextInput value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2" type="text" name="email" id="email" autoComplete="email" required />
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <FormLabel htmlFor="password" text="Password" />
                                    <Hyperlink className="text-sm" href="/forgot-password">Forgot password?</Hyperlink>
                                </div>
                                <FormShortTextInput value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" type="password" name="password" id="password" autoComplete="current-password" required />
                            </div>

                            <div>
                                <Button type="submit" variant='primary'>Log in</Button>
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