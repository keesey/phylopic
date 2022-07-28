import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
const useSponsor = (uuid: UUID) => {
    const imageSWR = useImageSWR(uuid)
    const submissionSWR = useSubmissionSWR(uuid)
    const data = useMemo(
        () => (submissionSWR.data?.sponsor === undefined ? imageSWR.data?.sponsor : submissionSWR.data?.sponsor),
        [imageSWR.data, submissionSWR.data],
    )
    return {
        data,
        error: submissionSWR.error,
        isValidating: imageSWR.isValidating || submissionSWR.isValidating,
    }
}
export default useSponsor
