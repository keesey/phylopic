import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { FC, Suspense } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
const ConfirmLogout = dynamic(() => import("~/screens/ConfirmLogout"), { ssr: false })
const Farewell = dynamic(() => import("~/screens/Farewell"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: Sign Out",
        }}
    >
        <Content />
    </PageLayout>
)
export default Page
const Content: FC = () => {
    const authorized = useAuthorized()
    if (authorized) {
        return (
            <Suspense fallback={<LoadingState>One moment…</LoadingState>}>
                <ConfirmLogout />
            </Suspense>
        )
    }
    return (
        <Suspense fallback={<LoadingState>Signing out…</LoadingState>}>
            <Farewell />
        </Suspense>
    )
}
