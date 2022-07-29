import { UUID } from "@phylopic/utils"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
const useCreationComplete = (uuid: UUID) => {
    const submission = useSubmissionSWR(uuid)
    const { data: image } = useImageSWR(uuid)
    return Boolean(image || submission.data?.created)
}
export default useCreationComplete
