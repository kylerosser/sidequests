import iconImage from '/icon.svg';
import { PageLayout } from '../components/page/PageLayout'
import { FormShortTextInput } from '../components/elements/FormShortTextInput'
import { FormLabel } from '../components/elements/FormLabel'
import { Hyperlink } from '../components/elements/Hyperlink'
import { Button } from '../components/elements/Button'

export const LoginPage = () => {
    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-8 py-12">
                <div className="mt-10 mx-auto w-full max-w-sm">
                    <img className="mx-auto h-20 w-auto" src={iconImage} alt="Sidequests logo" />
                    <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Adventure awaits</h2>
                    <p className="mt-1 text-center text-lg">Log in to your account to continue</p>
                </div>

                <div className="mt-10 mx-auto w-full max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <FormLabel htmlFor="email" text="Username or Email" />
                            <FormShortTextInput className="mt-2" type="email" name="email" id="email" autoComplete="email" required />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <FormLabel htmlFor="password" text="Password" />
                                <Hyperlink className="text-sm" href="/forgot-password">Forgot password?</Hyperlink>
                            </div>
                            <FormShortTextInput className="mt-2" type="password" name="password" id="password" autoComplete="current-password" required />
                        </div>

                        <div>
                            <Button type="submit" variant='primary'>Log in</Button>
                        </div>
                    </form>
                </div>

                <div>
                    <p className="mt-5 block font-medium text-center text-sm/6">New to Sidequests? <Hyperlink href="/signup">Create an account and start exploring!</Hyperlink></p>
                </div>
            </div>
        </PageLayout>
        
    )
}