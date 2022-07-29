import { AnchorLink, Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import FileView from "~/ui/FileView"
export type Props = {
    uuid: UUID
}
const ImageView: FC<Props> = ({ uuid }) => {
    const contributorUUID = useContributorUUID()
    const sourceKey = uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null
    const submissionKey =
        uuid && contributorUUID
            ? `/api/submissions/${encodeURIComponent(uuid)}/source/${encodeURIComponent(contributorUUID)}`
            : null
    const fetchExistence = useAuthorizedExistenceFetcher()
    const sourceExistsSWR = useSWR(sourceKey, fetchExistence, {
        errorRetryInterval: 60 * 1000,
    })
    const submissionExistsSWR = useSWR(submissionKey, fetchExistence)
    const hasSource = sourceExistsSWR.data
    const hasSubmission = submissionExistsSWR.data
    const isValidating = sourceExistsSWR.isValidating || submissionExistsSWR.isValidating
    const fileHRef = `/edit/${encodeURIComponent(uuid)}/file`
    if ((hasSource === undefined || hasSubmission === undefined) && isValidating) {
        return <Loader />
    }
    return (
        <section>
            {hasSource && sourceKey && (
                <figure key="source">
                    <FileView src={sourceKey} />
                    <figcaption>Accepted Image</figcaption>
                </figure>
            )}
            {hasSubmission && submissionKey && (
                <figure key="submission">
                    <FileView src={submissionKey} />
                    <figcaption>Pending Submission</figcaption>
                </figure>
            )}
            {hasSource === false && hasSubmission === false && (
                <>
                    You need to{" "}
                    <AnchorLink className="text" href={fileHRef}>
                        {" "}
                        upload an image
                    </AnchorLink>
                    .
                </>
            )}
        </section>
    )
}
export default ImageView
