import { Hash, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, useCallback } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import useSubmissionSWR from "~/editing/useSubmissionSWR"
import PageLayout from "~/pages/PageLayout"
import ErrorState from "~/screens/ErrorState"
import LoadingState from "~/screens/LoadingState"
const Uploader = dynamic(() => import("~/screens/Uploader"))
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => {
    return (
        <PageLayout
            head={{
                title: "PhyloPic: Replace Image File",
                url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(uuid)}/file`,
            }}
            imageUUID={uuid}
        >
            <AuthorizedOnly>
                <Content uuid={uuid} />
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    return { props: { uuid } }
}
const Content: FC<Props> = ({ uuid }) => {
    const { data, error } = useSubmissionSWR(uuid)
    const mutate = useSubmissionMutator(uuid)
    const router = useRouter()
    const cancel = useCallback(() => {
        router.push("/")
    }, [router])
    const complete = useCallback(
        (hash: Hash) => {
            mutate({ file: hash })
            router.push(`/edit/${encodeURIComponent(uuid)}`)
        },
        [mutate, uuid],
    )
    if (error) {
        return <ErrorState>{String(error)}</ErrorState>
    }
    if (!data) {
        return <LoadingState>Loading that up&hellip;</LoadingState>
    }
    return <Uploader onCancel={cancel} onComplete={complete} value={data.file} />
}
