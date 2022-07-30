import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import useFileSourceComplete from "~/editing/useFileSourceComplete"
import useUsageComplete from "~/editing/useUsageComplete"
import useNodesComplete from "~/editing/useNodesComplete"
import useHasSourceImage from "~/editing/useHasSourceImage"
const useRedirect = (uuid: UUID) => {
    const hasSource = useHasSourceImage(uuid)
    const fileSourceComplete = useFileSourceComplete(uuid)
    const nodesComplete = useNodesComplete(uuid)
    const licenseComplete = useUsageComplete(uuid)
    const router = useRouter()
    useEffect(() => {
        if (!hasSource) {
            if (fileSourceComplete === false) {
                router.push(`/edit/${encodeURIComponent(uuid)}/file`)
            } else if (nodesComplete === false) {
                router.push(`/edit/${encodeURIComponent(uuid)}/nodes`)
            } else if (licenseComplete === false) {
                router.push(`/edit/${encodeURIComponent(uuid)}/usage`)
            }
        }
    }, [fileSourceComplete, hasSource, licenseComplete, nodesComplete, router, uuid])
    const pending = useMemo(
        () =>
            !hasSource &&
            (fileSourceComplete === undefined || nodesComplete === undefined || licenseComplete === undefined),
        [fileSourceComplete, hasSource, licenseComplete, nodesComplete],
    )
    return { pending }
}
export default useRedirect
