import { Hash, isUUIDv4, UUID } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import ImageReview from "./ImageReview"
import { ReviewResult } from "./ImageReview/ReviewResult"
import SelectFile from "./SelectFile"
import { FileResult } from "./SelectFile/FileResult"
import UploadProgress from "./UploadProgress"
export type Props = {
    onCancel: () => void
    onComplete: (hash: Hash) => void
    existingUUID?: UUID
}
const Uploader: FC<Props> = ({ onCancel, onComplete, existingUUID }) => {
    const [fileResult, setFileResult] = useState<FileResult | undefined>()
    const [reviewResult, setReviewResult] = useState<ReviewResult | undefined>()
    const handleImageReviewCancel = useCallback(() => {
        setFileResult(undefined)
    }, [])
    const handleUploadProgressCancel = useCallback(() => {
        setFileResult(undefined)
        setReviewResult(undefined)
    }, [])
    if (!fileResult) {
        return <SelectFile onCancel={onCancel} onComplete={setFileResult} isReplacement={isUUIDv4(existingUUID)} />
    }
    if (!reviewResult) {
        return <ImageReview {...fileResult} onCancel={handleImageReviewCancel} onComplete={setReviewResult} />
    }
    return (
        <UploadProgress
            buffer={reviewResult.buffer}
            existingUUID={existingUUID}
            filename={fileResult?.file.name}
            onCancel={handleUploadProgressCancel}
            onComplete={onComplete}
            type={reviewResult.type}
        />
    )
}
export default Uploader
