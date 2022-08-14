import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useFileSourceComplete from "./useFileSourceComplete"
import useNodesComplete from "./useNodesComplete"
import useSubmissionComplete from "./useSubmissionComplete"
import useUsageComplete from "./useUsageComplete"
const useRatioComplete = (uuid: UUID | undefined) => {
    const fileSource = useFileSourceComplete(uuid)
    const license = useUsageComplete(uuid)
    const nodes = useNodesComplete(uuid)
    const submission = useSubmissionComplete(uuid)
    return useMemo(
        () =>
            [fileSource, license, nodes, submission]
                .map(bool => (bool === true ? 1 : bool === false ? 0 : NaN))
                .reduce<number>((sum, step) => sum + step, 0) / 4,
        [fileSource, license, nodes, submission],
    )
}
export default useRatioComplete
