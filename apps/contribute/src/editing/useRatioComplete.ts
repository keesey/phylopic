import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useCreationComplete from "./useCreationComplete"
import useFileSourceComplete from "./useFileSourceComplete"
import useLicenseComplete from "./useLicenseComplete"
import useNodesComplete from "./useNodesComplete"
const useRatioComplete = (uuid: UUID) => {
    const fileSource = useFileSourceComplete(uuid)
    const license = useLicenseComplete(uuid)
    const nodes = useNodesComplete(uuid)
    const creation = useCreationComplete(uuid)
    return useMemo(
        () =>
            [creation, fileSource, license, nodes]
                .map(bool => (bool ? 1 : 0))
                .reduce<number>((sum, step) => sum + step, 0) / 4,
        [creation, fileSource, license, nodes],
    )
}
export default useRatioComplete
