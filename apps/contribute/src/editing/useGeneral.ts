import { NodeIdentifier } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
import useSWRImmutable from "swr/immutable"
import { useAPIFetcher } from "@phylopic/utils-api"
import { Node } from "@phylopic/api-models"
const useGeneral = (uuid: UUID) => {
    const imageSWR = useImageSWR(uuid)
    const submissionSWR = useSubmissionSWR(uuid)
    const imageGeneral = imageSWR.data?.general
    const apiFetcher = useAPIFetcher<Node>()
    const imageGeneralSWR = useSWRImmutable(
        imageGeneral ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(imageGeneral)}` : null,
        apiFetcher,
    )
    const name = imageGeneralSWR.data?.names[0]
    const data = useMemo<NodeIdentifier | null | undefined>(() => {
        if (submissionSWR.data?.general !== undefined) {
            return submissionSWR.data.general
        }
        if (imageGeneral === null) {
            return null
        }
        if (imageGeneral && name) {
            return {
                identifier: `phylopic.org/nodes/${imageGeneral}`,
                name,
            }
        }
    }, [imageGeneral, name, submissionSWR.data?.general])
    return {
        data,
        error: submissionSWR.error ?? imageGeneralSWR.error,
        isValidating: imageSWR.isValidating || imageGeneralSWR.isValidating || submissionSWR.isValidating,
    }
}
export default useGeneral
