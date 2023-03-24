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
    existing?: UUID
}
const Page: NextPage<Props> = ({ existing }) => {
    return (
        <PageLayout
            seo={{
                noindex: true,
                title: "PhyloPic: Upload New Image File",
            }}
        >
            <AuthorizedOnly>
                <Content existing={existing} />
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
const Content: FC<Props> = ({ existing }) => {
    const router = useRouter()
    const cancel = () => {
        if (existing) {
            router.push(`/images/${encodeURIComponent(existing)}`)
        } else {
            router.push("/")
        }
    }
    const complete = (hash: Hash) => {
        router.push(`/edit/${encodeURIComponent(hash)}`)
    }
    return (
        <Suspense fallback={<LoadingState>Let&rsquo;s go!</LoadingState>}>
            <Uploader onCancel={cancel} onComplete={complete} existingUUID={existing} />
        </Suspense>
    )
}
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { existing } = context.query ?? {}
    if (existing) {
        if (!isUUIDv4(existing)) {
            return {
                redirect: {
                    destination: "/upload",
                    permanent: true,
                },
            }
        }
        return { props: { existing: existing } }
    }
    return { props: {} }
}
