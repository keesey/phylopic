import { Node } from "@phylopic/api-models"
import { Contribution } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import axios from "axios"
import { useCallback, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionKey from "~/s3/swr/useSubmissionKey"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
type ContributionPatch = Partial<Omit<Contribution, "contributor" | "created" | "uuid">>
const useContribution = (uuid: UUID): Readonly<[Partial<Contribution>, (value: ContributionPatch) => void]> => {
    const submissionKey = useSubmissionKey(uuid)
    const { data: submission, mutate } = useSubmissionSWR(uuid)
    const { data: image } = useImageSWR(uuid)
    const apiFetcher = useAPIFetcher<Node>()
    const { data: generalNode } = useSWRImmutable(
        image?.general ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.general)}` : null,
        apiFetcher,
    )
    const { data: specificNode } = useSWRImmutable(
        image?.specific ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.specific)}` : null,
        apiFetcher,
    )
    const contribution = useMemo<Partial<Contribution>>(
        () => ({
            attribution: image?.attribution,
            contributor: image?.contributor,
            created: image?.created,
            general:
                image?.general && generalNode?.names?.[0]
                    ? {
                          identifier: `phylopic.org/nodes/${encodeURIComponent(image.general)}`,
                          name: generalNode.names[0],
                      }
                    : undefined,
            license: image?.license,
            sponsor: image?.sponsor,
            specific:
                image?.specific && specificNode?.names?.[0]
                    ? {
                          identifier: `phylopic.org/nodes/${encodeURIComponent(image.specific)}`,
                          name: specificNode.names[0],
                      }
                    : undefined,
            ...submission,
            uuid,
        }),
        [image, submission],
    )
    const setContribution = useCallback(
        (value: ContributionPatch) => {
            const newData = {
                ...submission,
                ...value,
            }
            const options = { optimisticData: newData, rollbackOnError: true }
            mutate(async () => {
                if (!submissionKey) {
                    throw new Error("Not authorized.")
                }
                await axios.patch(submissionKey, value)
                return newData
            }, options)
        },
        [mutate, submission, submissionKey, uuid],
    )
    return [contribution, setContribution]
}
export default useContribution
