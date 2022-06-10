/* eslint-disable @next/next/no-img-element */
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import ImageReview from "./ImageReview"
import { ReviewResult } from "./ImageReview/ReviewResult"
import SelectFile from "./SelectFile"
import { FileResult } from "./SelectFile/FileResult"
import UploadProgress from "./UploadProgress"
const Uploader: FC = () => {
    const [fileResult, setFileResult] = useState<FileResult | undefined>()
    const [reviewResult, setReviewResult] = useState<ReviewResult | undefined>()
    const router = useRouter()
    const handleImageReviewCancel = useCallback(() => {
        setFileResult(undefined)
    }, [])
    const handleUploadProgressComplete = useCallback(
        (uuid: UUID) => {
            router.push(`/images/uploaded/${encodeURIComponent(uuid)}`)
        },
        [router],
    )
    if (!fileResult) {
        return <SelectFile onComplete={setFileResult} />
    }
    if (!reviewResult) {
        return <ImageReview {...fileResult} onCancel={handleImageReviewCancel} onComplete={setReviewResult} />
    }
    return (
        <UploadProgress
            buffer={reviewResult.buffer}
            onComplete={handleUploadProgressComplete}
            type={reviewResult.type}
        />
    )
}
export default Uploader
