import { useCallback } from "react"
import useSWR from "swr"
const useImagesInvalidator = () => {
    const { mutate: mutateCount } = useSWR("/api/imagecount")
    const { mutate: mutateAccepted } = useSWR("/api/images?filter=accepted&page=0")
    const { mutate: mutateIncomplete } = useSWR("/api/images?filter=incomplete&page=0")
    const { mutate: mutateSubmitted } = useSWR("/api/images?filter=submitted&page=0")
    const { mutate: mutateWithdrawn } = useSWR("/api/images?filter=withdrawn&page=0")
    return useCallback(() => {
        mutateCount(undefined, { revalidate: true })
        mutateAccepted(undefined, { revalidate: true })
        mutateIncomplete(undefined, { revalidate: true })
        mutateSubmitted(undefined, { revalidate: true })
        mutateWithdrawn(undefined, { revalidate: true })
    }, [mutateAccepted, mutateCount, mutateIncomplete, mutateSubmitted, mutateWithdrawn])
}
export default useImagesInvalidator
