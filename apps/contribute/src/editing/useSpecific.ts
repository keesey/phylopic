import { NodeIdentifier } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
import useSWRImmutable from "swr/immutable"
import { useAPIFetcher } from "@phylopic/utils-api"
import { Node } from "@phylopic/api-models"
const useSpecific = (uuid: UUID) => {
    const imageSWR = useImageSWR(uuid)
    const submissionSWR = useSubmissionSWR(uuid)
    const imageSpecific = imageSWR.data?.specific
    const apiFetcher = useAPIFetcher<Node>()
    const imageSpecificSWR = useSWRImmutable(
        imageSpecific ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(imageSpecific)}` : null,
        apiFetcher,
    )
    const name = imageSpecificSWR.data?.names[0]
    const data = useMemo<NodeIdentifier | undefined>(() => {
        if (submissionSWR.data?.specific) {
            return submissionSWR.data.specific
        }
        if (imageSpecific && name) {
            return {
                identifier: `phylopic.org/nodes/${imageSpecific}`,
                name,
            }
        }
    }, [imageSpecific, name, submissionSWR.data?.specific])
    return {
        data,
        error: submissionSWR.error ?? imageSpecificSWR.error,
        isValidating: imageSWR.isValidating || imageSpecificSWR.isValidating || submissionSWR.isValidating,
    }
}
export default useSpecific
