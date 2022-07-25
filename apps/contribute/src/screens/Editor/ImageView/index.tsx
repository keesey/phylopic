import { AnchorLink, Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
import FileView from "~/ui/FileView"
export type Props = {
    uuid: UUID
}
const ImageView: FC<Props> = ({ uuid }) => {
    const sourceKey = uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null
    const submissionKey = uuid ? `/api/submissions/${encodeURIComponent(uuid)}/source` : null
    const fetchExists = useAuthorizedExistenceFetcher()
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
            {!hasSource && !hasSubmission && (
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
