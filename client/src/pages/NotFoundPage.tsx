import { PageLayout } from '../components/page/PageLayout'

export const NotFoundPage = () => {
    return (
        <PageLayout>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight">Hmm... something went wrong</h2>
                <p className="mt-1 text-center text-lg">This page could not be found</p>
            </div>
            
        </PageLayout>
    )
}