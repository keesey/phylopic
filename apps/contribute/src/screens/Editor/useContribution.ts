import { Node } from "@phylopic/api-models"
import { Contribution } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { useCallback, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import useImageSWR from "~/s3/swr/useImageSWR"
import axios from "axios"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
import useSubmissionKey from "~/s3/swr/useSubmissionKey"
type ContributionPatch = Partial<Omit<Contribution, "contributor" | "created" | "uuid">>
const useContribution = (uuid: UUID): Readonly<[Partial<Contribution>, (value: ContributionPatch) => void]> => {
    const email = useEmailAddress()
    const submissionKey = useSubmissionKey(email, uuid)
    const { data: submission, mutate } = useSubmissionSWR(email, uuid)
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
        [email, mutate, submission, submissionKey, uuid],
    )
    return [contribution, setContribution]
}
export default useContribution
