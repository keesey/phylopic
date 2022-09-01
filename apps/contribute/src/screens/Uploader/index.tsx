import { Hash } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import ImageReview from "./ImageReview"
import { ReviewResult } from "./ImageReview/ReviewResult"
import SelectFile from "./SelectFile"
import { FileResult } from "./SelectFile/FileResult"
import UploadProgress from "./UploadProgress"
export type Props = {
    onCancel: () => void
    onComplete: (hash: Hash) => void
    value?: Hash
}
const Uploader: FC<Props> = ({ onCancel, onComplete, value }) => {
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
        return <SelectFile onCancel={onCancel} onComplete={setFileResult} value={value} />
    }
    if (!reviewResult) {
        return <ImageReview {...fileResult} onCancel={handleImageReviewCancel} onComplete={setReviewResult} />
    }
    return (
        <UploadProgress
            buffer={reviewResult.buffer}
            filename={fileResult?.file.name}
            onCancel={handleUploadProgressCancel}
            onComplete={onComplete}
            type={reviewResult.type}
        />
    )
}
export default Uploader
