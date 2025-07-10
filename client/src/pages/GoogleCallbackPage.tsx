import { PageLayout } from '../components/layouts/PageLayout'
import { Spinner } from '../components/common/Spinner'

export const GoogleCallbackPage = () => {
    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-4 py-12 pt-20">
                <Spinner/>
            </div>
        </PageLayout>
    )
}