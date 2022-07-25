import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
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
    const { data: hasSource } = useSWR(sourceKey, fetchExists)
    const { data: hasSubmission } = useSWR(submissionKey, fetchExists)
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
            {!hasSource && !hasSubmission && "You need to upload an image."}
        </section>
    )
}
export default ImageView
