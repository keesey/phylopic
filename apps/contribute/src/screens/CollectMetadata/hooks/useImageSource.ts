import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useFetcher from "~/auth/hooks/useFetcher"
import useAsyncMemo from "~/utils/useAsyncMemo"
const useImageSource = (uuid: UUID) => {
    const fetcher = useFetcher<Buffer>({ accept: "image/*" })
    const { data, isValidating, error } = useSWR(`/api/imagefiles/${encodeURIComponent(uuid)}`, { fetcher })
    const source = useMemo(() => {
        if (data) {
            const blob = new Blob([data.data], { type: data.headers["content-type"] })
            const urlCreator = window.URL ?? window.webkitURL
            return urlCreator.createObjectURL(blob)
        }
    }, [data])
    return useAsyncMemo(source, error, isValidating && !(source || error))
}
export default useImageSource
