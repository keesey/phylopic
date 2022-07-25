import { AnchorLink, Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import useSWR from "swr"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import getSubmissionKey from "~/s3/keys/submissions/getSubmissionKey"
import fetchExists from "~/swr/fetchExists"
import FileView from "~/ui/FileView"
export type Props = {
    uuid: UUID
}
const ImageView: FC<Props> = ({ uuid }) => {
    const contributorUUID = useContributorUUID()
    const sourceKey = `/api/images/${encodeURIComponent(uuid)}/source`
    const submissionKey = contributorUUID ? "/api/" + getSubmissionKey(contributorUUID, uuid) : null
    const { data: hasSource, isValidating: sourceIsValidating } = useSWR(sourceKey, fetchExists)
    const { data: hasSubmission, isValidating: submissionIsValidating } = useSWR(submissionKey, fetchExists)
    const isValidating = sourceIsValidating || submissionIsValidating
    const fileHRef = `/edit/${encodeURIComponent(uuid)}/file`
    const router = useRouter()
    useEffect(() => {
        if (!isValidating && !hasSource && !hasSubmission) {
            router.push(fileHRef)
        }
    }, [fileHRef, hasSource, hasSubmission, isValidating, router])
    if (!hasSource && !hasSubmission && isValidating) {
        return <Loader />
    }
    return (
        <section>
            {hasSource && (
                <figure key="source">
                    <FileView src={sourceKey} />
                    <figcaption>Accepted Image</figcaption>
                </figure>
            )}
            {hasSubmission && (
                <figure key="submission">
                    <FileView src={sourceKey} />
                    <figcaption>Pending Submission</figcaption>
                </figure>
            )}
            {!hasSource && !hasSubmission && (
                <>
                    You need to <AnchorLink className="text" href={fileHRef}> upload an image</AnchorLink>.
                </>
            )}
        </section>
    )
}
export default ImageView
