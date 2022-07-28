import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import useFileSourceComplete from "~/editing/useFileSourceComplete"
import useLicenseComplete from "~/editing/useLicenseComplete"
import useNodesComplete from "~/editing/useNodesComplete"
const useRedirect = (uuid: UUID) => {
    const fileSourceComplete = useFileSourceComplete(uuid)
    const nodesComplete = useNodesComplete(uuid)
    const licenseComplete = useLicenseComplete(uuid)
    const router = useRouter()
    useEffect(() => {
        if (fileSourceComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/file`)
        } else if (nodesComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/nodes`)
        } else if (licenseComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/license`)
        }
    }, [fileSourceComplete, licenseComplete, nodesComplete, router, uuid])
    const pending = useMemo(
        () => fileSourceComplete === undefined || nodesComplete === undefined || licenseComplete === undefined,
        [fileSourceComplete, licenseComplete, nodesComplete],
    )
    return { pending }
}
export default useRedirect
