import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import isNotFoundError from "~/http/isNotFoundError"
import isServerError from "~/http/isServerError"
const useLiveImageExists = (uuid?: UUID) => {
    const apiFetcher = useAPIFetcher()
    const imageKey = useMemo(
        () => (uuid ? `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(uuid)}` : null),
        [uuid],
    )
    const { data, error } = useSWRImmutable(imageKey, apiFetcher, {
        shouldRetryOnError: isServerError,
    })
    const notFound = useMemo(() => isNotFoundError(error), [error])
    if (Boolean(data)) {
        return true
    }
    if (data === null) {
        return false
    }
    return notFound ? false : undefined
}
export default useLiveImageExists
