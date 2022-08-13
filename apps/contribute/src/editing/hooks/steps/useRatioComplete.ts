import { useMemo } from "react"
import useFileSourceComplete from "./useFileSourceComplete"
import useNodesComplete from "./useNodesComplete"
import useSubmissionComplete from "./useSubmissionComplete"
import useUsageComplete from "./useUsageComplete"
const useRatioComplete = () => {
    const fileSource = useFileSourceComplete()
    const license = useUsageComplete()
    const nodes = useNodesComplete()
    const submission = useSubmissionComplete()
    return useMemo(
        () =>
            [fileSource, license, nodes, submission]
                .map(bool => (bool === true ? 1 : bool === false ? 0 : NaN))
                .reduce<number>((sum, step) => sum + step, 0) / 4,
        [fileSource, license, nodes, submission],
    )
}
export default useRatioComplete
