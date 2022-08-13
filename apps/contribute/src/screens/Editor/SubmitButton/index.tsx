import { FC, useCallback } from "react"
import useFileSourceComplete from "~/editing/hooks/steps/useFileSourceComplete"
import useNodesComplete from "~/editing/hooks/steps/useNodesComplete"
import useUsageComplete from "~/editing/hooks/steps/useUsageComplete"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
const SubmitButton: FC = () => {
    const image = useImage()
    const mutate = useImageMutator()
    const handleClick = useCallback(() => {
        mutate({ submitted: true })
    }, [mutate])
    const fileSourceComplete = useFileSourceComplete()
    const usageComplete = useUsageComplete()
    const nodesComplete = useNodesComplete()
    const ready = fileSourceComplete && usageComplete && nodesComplete
    if (!ready || image?.submitted) {
        return null
    }
    return (
        <button className="cta" onClick={handleClick}>
            All done. Submit it!
        </button>
    )
}
export default SubmitButton
