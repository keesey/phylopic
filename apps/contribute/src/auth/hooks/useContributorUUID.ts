import { UUID } from "@phylopic/utils"
import usePayload from "./usePayload"
const useContributorUUID = (): UUID | null => {
    const { sub } = usePayload() ?? {}
    return sub ?? null
}
export default useContributorUUID
