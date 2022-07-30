import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, ReactNode, useCallback } from "react"
import useHasSourceImage from "~/editing/useHasSourceImage"
import useHasSubmission from "~/editing/useHasSubmission"
import useSubmissionDeleter from "~/s3/swr/useSubmissionDeleter"
export type Props = {
    uuid: UUID
}
const getResponseMessage = (hasSource: boolean | undefined): string => {
    if (hasSource) {
        return "Your revisions have been withdrawn. Your image will remain as it was."
    }
    return "Your submission has been removed."
}
const getConfirmationMessage = (hasSource: boolean | undefined): string => {
    if (hasSource) {
        return "Are you sure you want to withdraw the revisions you've made for this image?"
    }
    return "Are you sure you want to permanently remove this submission?"
}
const getButtonLabel = (hasSource: boolean | undefined): ReactNode => {
    if (hasSource) {
        return "Withdraw these revisions"
    }
    return "Delete this submission"
}
const DeleteButton: FC<Props> = ({ uuid }) => {
    const hasSource = useHasSourceImage(uuid)
    const hasSubmission = useHasSubmission(uuid)
    const router = useRouter()
    const handleDeleteComplete = useCallback(() => {
        alert(getResponseMessage(hasSource))
        router.push(`/`)
    }, [hasSource, router])
    const deleter = useSubmissionDeleter(uuid, handleDeleteComplete)
    const handleClick = useCallback(() => {
        if (confirm(getConfirmationMessage(hasSource))) {
            deleter()
        }
    }, [deleter, hasSource])
    if (!hasSubmission || hasSource === undefined) {
        return null
    }
    return (
        <button className="cta-delete" onClick={handleClick}>
            {getButtonLabel(hasSource)}
        </button>
    )
}
export default DeleteButton
