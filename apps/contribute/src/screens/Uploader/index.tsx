/* eslint-disable @next/next/no-img-element */
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import ImageReview from "./ImageReview"
import { ReviewResult } from "./ImageReview/ReviewResult"
import SelectFile from "./SelectFile"
import { FileResult } from "./SelectFile/FileResult"
import UploadProgress from "./UploadProgress"
export type Props = {
    uuid: UUID
}
const Uploader: FC<Props> = ({ uuid }) => {
    const [fileResult, setFileResult] = useState<FileResult | undefined>()
    const [reviewResult, setReviewResult] = useState<ReviewResult | undefined>()
    const router = useRouter()
    const handleImageReviewCancel = useCallback(() => {
        setFileResult(undefined)
    }, [])
    const handleUploadProgressComplete = useCallback(
        (uuid: UUID) => {
            console.debug("COMPLETED UPLOAD", uuid)
            router.push(`/edit/${encodeURIComponent(uuid)}`)
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
            uuid={uuid}
        />
    )
}
export default Uploader
