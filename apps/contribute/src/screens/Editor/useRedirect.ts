import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useFileSourceComplete from "~/editing/hooks/steps/useFileSourceComplete"
import useNodesComplete from "~/editing/hooks/steps/useNodesComplete"
import useUsageComplete from "~/editing/hooks/steps/useUsageComplete"
const useRedirect = (uuid: UUID) => {
    const fileSourceComplete = useFileSourceComplete(uuid)
    const nodesComplete = useNodesComplete(uuid)
    const licenseComplete = useUsageComplete(uuid)
    const router = useRouter()
    useEffect(() => {
        if (fileSourceComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/file`)
        } else if (nodesComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/nodes`)
        } else if (licenseComplete === false) {
            router.push(`/edit/${encodeURIComponent(uuid)}/usage`)
        }
    }, [fileSourceComplete, licenseComplete, nodesComplete, router, uuid])
    console.log(fileSourceComplete, nodesComplete, licenseComplete)
    const pending = fileSourceComplete === undefined || nodesComplete === undefined || licenseComplete === undefined
    const redirecting = fileSourceComplete === false || nodesComplete === false || licenseComplete === false
    return { pending, redirecting }
}
export default useRedirect
