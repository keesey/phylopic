import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useCreationComplete from "./useCreationComplete"
import useFileSourceComplete from "./useFileSourceComplete"
import useUsageComplete from "./useUsageComplete"
import useNodesComplete from "./useNodesComplete"
const useRatioComplete = (uuid: UUID) => {
    const fileSource = useFileSourceComplete(uuid)
    const license = useUsageComplete(uuid)
    const nodes = useNodesComplete(uuid)
    const creation = useCreationComplete(uuid)
    return useMemo(
        () =>
            [creation, fileSource, license, nodes]
                .map(bool => (bool == true ? 1 : bool === false ? 0 : NaN))
                .reduce<number>((sum, step) => sum + step, 0) / 4,
        [creation, fileSource, license, nodes],
    )
}
export default useRatioComplete
