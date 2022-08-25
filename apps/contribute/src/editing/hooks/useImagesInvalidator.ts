import { useCallback } from "react"
import useSWR from "swr"
const useImagesInvalidator = () => {
    const { mutate: mutateCount } = useSWR("/api/imagecount")
    const { mutate: mutateAccepted } = useSWR("/api/images?filter=accepted&page=0")
    const { mutate: mutateIncomplete } = useSWR("/api/images?filter=incomplete&page=0")
    const { mutate: mutateSubmitted } = useSWR("/api/images?filter=submitted&page=0")
    const { mutate: mutateWithdrawn } = useSWR("/api/images?filter=withdrawn&page=0")
    return useCallback(() => {
        mutateCount(async (x: any) => x, { revalidate: true })
        mutateAccepted(async (x: any) => x, { revalidate: true })
        mutateIncomplete(async (x: any) => x, { revalidate: true })
        mutateSubmitted(async (x: any) => x, { revalidate: true })
        mutateWithdrawn(async (x: any) => x, { revalidate: true })
    }, [mutateAccepted, mutateCount, mutateIncomplete, mutateSubmitted, mutateWithdrawn])
}
export default useImagesInvalidator
