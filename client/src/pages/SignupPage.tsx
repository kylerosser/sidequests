import { useState } from "react";
import { useNavigate } from "react-router"

import { PageLayout } from '../components/layouts/PageLayout'
import { FormShortTextInput } from '../components/common/FormShortTextInput'
import { FormLabel } from '../components/common/FormLabel'
import { Hyperlink } from '../components/common/Hyperlink'
import { Button } from '../components/common/Button'

import { authApi } from '../api/authApi'

import signUpWithGoogleImage from '/google_login_SU.svg';

export const SignupPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false); // True if waiting for server respond to form submit

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitLoading) return;
        setSubmitLoading(true);

        const signupResponse = await authApi.signupWithEmail(username, email, password);
        if (signupResponse.success) {
            // Signup success: redirect to verify email page
            navigate('/verify');
        } else {
            setSubmitLoading(false);
            if (typeof signupResponse.data == "string") {
                setError(signupResponse.data);
            } else {
                console.log(signupResponse)
                setError("An error occurred. Please try again later");
            }
        }
    };

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    <div className="mt-10 ">
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Create your account</h2>
                        <p className="mt-1 text-center text-lg">Sign up to get started — it only takes a minute.</p>
                    </div>

                    <div className="flex mt-5">
                        <button className="mx-auto cursor-pointer"><img src={signUpWithGoogleImage}/></button>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 my-5">
                            <hr className="flex-grow border-t border-sq-grey" />
                            <span className="text-gray-500 text-sm select-none">OR</span>
                            <hr className="flex-grow border-t border-sq-grey" />
                        </div>
                    </div>

                    <div className="mx-auto w-full max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <FormLabel htmlFor="username" text="Username" />
                                <FormShortTextInput value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2" type="text" name="username" id="username" autoComplete="username" required />
                            </div>
                            <div>
                                <FormLabel htmlFor="email" text="Email" />
                                <FormShortTextInput value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" type="text" name="email" id="email" autoComplete="email" required />
                            </div>
                            <div>
                                <FormLabel htmlFor="password" text="Password" />
                                <FormShortTextInput value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" type="password" name="password" id="password" autoComplete="new-password" required />
                            </div>
                            <div className="text-center">
                                <Button loading={submitLoading} type="submit" variant='primary'>Create Account</Button>
                                <span className={`text-sq-red text-sm/6 font-medium ${error ? "" : "hidden"}`}>{error}</span>
                            </div>
                        </form>
                        
                    </div>

                    <div>
                        <p className="mb-8 mt-5 block font-medium text-center text-sm/6">Already have an account? <Hyperlink href="/login">Log in</Hyperlink></p>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}