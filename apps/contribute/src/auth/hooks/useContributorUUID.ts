import { UUID } from "@phylopic/utils"
import usePayload from "./usePayload"
const useContributorUUID = (): UUID | null => {
    const { uuid } = usePayload() ?? {}
    return uuid ?? null
}
export default useContributorUUID
