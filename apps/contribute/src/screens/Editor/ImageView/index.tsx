import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import fetchExists from "~/swr/fetchExists"
import FileView from "~/ui/FileView"
export type Props = {
    uuid: UUID
}
const ImageView: FC<Props> = ({ uuid }) => {
    const sourceKey = `/api/s3/source/images/${encodeURIComponent(uuid)}/source`
    const submissionKey = `/api/s3/contribute/submissionfiles/${encodeURIComponent(uuid)}`
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
