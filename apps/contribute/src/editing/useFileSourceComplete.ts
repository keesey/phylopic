import { UUID } from "@phylopic/utils"
import useFileSource from "./useFileSource"
const useFileSourceComplete = (uuid: UUID) => {
    const { data, error, isValidating } = useFileSource(uuid)
    return error || (!data && isValidating) ? undefined : Boolean(data)
}
export default useFileSourceComplete
