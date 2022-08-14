import { UUID } from "@phylopic/utils"
import useImageSWR from "../useImageSWR"
const useNodesComplete = (uuid: UUID | undefined) => {
    const { data } = useImageSWR(uuid)
    return !data ? undefined : Boolean(data.specific)
}
export default useNodesComplete
