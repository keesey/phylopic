import { Node } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import fetchJSON from "~/fetch/fetchJSON"
import isServerError from "~/http/isServerError"
import useImage from "./useImage"
const useImageNode = (uuid: UUID | undefined, property: "general" | "specific") => {
    const image = useImage(uuid)
    const key = useMemo(() => {
        const value = image?.[property]
        if (isUUIDv4(value)) {
            return `/api/nodes/${encodeURIComponent(value)}`
        }
        return null
    }, [image, property])
    const { data } = useSWRImmutable<Node>(key, fetchJSON, {
        shouldRetryOnError: isServerError,
    })
    return data
}
export default useImageNode
