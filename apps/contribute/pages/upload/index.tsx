import { Hash } from "@phylopic/utils"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, useCallback } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Uploader = dynamic(() => import("~/screens/Uploader"))
const Page: NextPage = () => {
    return (
        <PageLayout
            head={{
                title: "PhyloPic: Upload New Image File",
                url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/upload`,
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
    return <Uploader onCancel={cancel} onComplete={complete} />
}
