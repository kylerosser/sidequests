import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import { PageLayout } from '../components/layouts/PageLayout'
import { Spinner } from '../components/common/Spinner'
import { Button } from '../components/common/Button'

import { useAuth } from "../auth/useAuth";

export const GoogleCallbackPage = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const [error, setError] = useState(false);

    // Run once on page load: (hasRun debounce so that nothing breaks in react strict mode for testing)
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        if (!code) {
            setError(true);
            return;
        }
        setError(false);
        (async () => {
            const requestResponse = await loginWithGoogle(code as string);
            if (requestResponse.success) {
                navigate('/quests')
            } else {
                setError(true)
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadingView = (<>
        <p className="my-5 text-center text-lg">Signing you in...</p>
        <Spinner/>
    </>)

    const errorView = (<>
        <p className="my-5 text-center text-lg">We couldn't sign you in with Google. Please try another sign in method.</p>
        <div className="flex flex-col items-center">
            <Link to="/login"><Button>Go back</Button></Link>
        </div>
    </>)

    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                {error ? errorView : loadingView}
            </div>
        </PageLayout>
    )
}