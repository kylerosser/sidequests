import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom"

import { Spinner } from "../components/common/Spinner"
import { PageLayout } from '../components/layouts/PageLayout'
import { Button } from '../components/common/Button'

import { authApi } from '../api/authApi'

export const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    // If a token is provided as a search param, the verify page will attempt to send verify request to the server
    // Otherwise it will display the standard message telling the user to check their email for a verify link
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"no-token" | "verifying" | "verified" | "failed">(token ? "verifying" : "no-token")

    // Run once on page load:
    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            const verifyResponse = await authApi.verifyEmail(token)
            if (verifyResponse.success) {
                setStatus("verified")
            } else {
                setStatus("failed")
            }
        }

        verifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const noTokenView = (<>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">One last step!</h2>
        <p className="mt-1 text-center text-md">We've sent a verification link to your email address. Please click the link to activate your account.</p>
        <p className="mt-4 text-center text-sm">If you don't see the email, be sure to check your spam or junk folder — sometimes it ends up there by mistake.</p>
    </>)

    const verifyingView = (<>
        <p className="mb-6 text-center text-lg font-semibold">Verifying...</p>
        <Spinner/>
    </>)

    const verifiedView = (<>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Email Verified</h2>
        <p className="mt-1 text-center text-md">You are now ready to log in to your account!</p>
        <div className="mt-6 flex flex-col items-center">
            <Link to="/login"><Button>Log in</Button></Link>
        </div>
    </>)

    const failedView = (<>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Verification Failed</h2>
        <p className="mt-1 text-center text-md">This verification link has expired and is no longer valid. To resend another verification link, please attempt to log in to your account again.</p>
        <div className="mt-6 flex flex-col items-center">
            <Link to="/login"><Button>Log in</Button></Link>
        </div>
    </>)

    const viewOptions = {
        "no-token": noTokenView,
        "verifying": verifyingView,
        "verified": verifiedView,
        "failed": failedView,
    }

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    <div className="my-10">
                        {viewOptions[status]}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
