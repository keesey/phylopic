import { Hash, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
const Uploader = dynamic(() => import("~/screens/Uploader"), { ssr: false })
export type Props = {
    replace?: UUID
}
const Page: NextPage<Props> = ({ replace }) => {
    return (
        <PageLayout
            seo={{
                noindex: true,
                title: "PhyloPic: Upload New Image File",
            }}
        >
            <AuthorizedOnly>
                <Content replace={replace} />
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
const Content: FC<Props> = ({ replace }) => {
    const router = useRouter()
    const cancel = () => {
        if (replace) {
            router.push(`/images/${encodeURIComponent(replace)}`)
        } else {
            router.push("/")
        }
    }
    const complete = (hash: Hash) => {
        if (replace) {
            router.push(`/images/${encodeURIComponent(replace)}`)
        } else {
            router.push(`/edit/${encodeURIComponent(hash)}`)
        }
    }
    return (
        <Suspense fallback={<LoadingState>Let&rsquo;s go!</LoadingState>}>
            <Uploader onCancel={cancel} onComplete={complete} replaceUUID={replace} />
        </Suspense>
    )
}
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { replace } = context.query ?? {}
    if (replace) {
        if (!isUUIDv4(replace)) {
            return {
                redirect: {
                    destination: "/upload",
                    permanent: true,
                },
            }
        }
        return { props: { replace } }
    }
    return { props: {} }
}
