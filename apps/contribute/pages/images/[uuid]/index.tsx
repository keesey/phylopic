import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
const ImageScreen = dynamic(() => import("~/screens/Image"), { ssr: false })
export type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: Your Submission",
        }}
    >
        <AuthorizedOnly>
            <Suspense fallback={<LoadingState>Loading…</LoadingState>}>
                <ImageScreen uuid={uuid} />
            </Suspense>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getStaticPaths: GetStaticPaths = async _context => {
    return {
        paths: [],
        fallback: "blocking",
    }
}
export const getStaticProps: GetStaticProps<Props> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    return { props: { uuid } }
}
