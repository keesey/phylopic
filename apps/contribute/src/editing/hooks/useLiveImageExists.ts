import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import is4xxError from "~/http/is4xxError"
import is5xxError from "~/http/is5xxError"
const useLiveImageExists = (uuid?: UUID) => {
    const apiFetcher = useAPIFetcher()
    const imageKey = useMemo(
        () => (uuid ? `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(uuid)}` : null),
        [uuid],
    )
    const { data, error } = useSWRImmutable(imageKey, apiFetcher, {
        shouldRetryOnError: is5xxError,
    })
    const notFound = useMemo(() => is4xxError(error), [error])
    if (Boolean(data)) {
        return true
    }
    return notFound ? false : undefined
}
export default useLiveImageExists
