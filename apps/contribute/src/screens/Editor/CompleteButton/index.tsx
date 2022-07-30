import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback } from "react"
import useFileSourceComplete from "~/editing/useFileSourceComplete"
import useNodesComplete from "~/editing/useNodesComplete"
import useUsageComplete from "~/editing/useUsageComplete"
import useSubmissionPatcher from "~/s3/swr/useSubmissionPatcher"
export type Props = {
    uuid: UUID
}
const CompleteButton: FC<Props> = ({ uuid }) => {
    const fileSourceComplete = useFileSourceComplete(uuid)
    const usageComplete = useUsageComplete(uuid)
    const nodesComplete = useNodesComplete(uuid)
    const router = useRouter()
    const handlePatchComplete = useCallback(() => router.push(`/`), [router])
    const patch = useSubmissionPatcher(uuid, handlePatchComplete)
    const handleClick = useCallback(() => {
        patch({ created: new Date().toISOString() })
    }, [patch])
    const ready = fileSourceComplete && usageComplete && nodesComplete
    if (!ready) {
        return null
    }
    return (
        <button className="cta" onClick={handleClick}>
            All done
        </button>
    )
}
export default CompleteButton
