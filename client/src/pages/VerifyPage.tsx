import { Button } from '../components/common/Button'
import { PageLayout } from '../components/layouts/PageLayout'

export const VerifyPage = () => {
    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <div className="bg-white rounded-lg border-1 border-sq-grey mx-auto w-full max-w-md px-6">
                    <div className="my-10">
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">One last step!</h2>
                        <p className="mt-1 text-center text-md">We've sent a verification link to your email address. Please click the link to activate your account.</p>
                        <p className="mt-4 text-center text-sm">If you don't see the email, be sure to check your spam or junk folder — sometimes it ends up there by mistake.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
