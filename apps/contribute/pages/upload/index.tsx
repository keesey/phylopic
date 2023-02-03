import { Hash } from "@phylopic/utils"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, Suspense, useCallback } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
const Uploader = dynamic(() => import("~/screens/Uploader"), { ssr: false })
const Page: NextPage = () => {
    return (
        <PageLayout
            seo={{
                noindex: true,
                title: "PhyloPic: Upload New Image File",
            }}
        >
            <AuthorizedOnly>
                <Content />
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
const Content: FC = () => {
    const router = useRouter()
    const cancel = useCallback(() => {
        router.push("/")
    }, [router])
    const complete = useCallback(
        (hash: Hash) => {
            router.push(`/edit/${encodeURIComponent(hash)}`)
        },
        [router],
    )
    return (
        <Suspense fallback={<LoadingState>Let&rsquo;s go!</LoadingState>}>
            <Uploader onCancel={cancel} onComplete={complete} />
        </Suspense>
    )
}
