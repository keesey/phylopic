import { EmailAddress } from "@phylopic/utils"
import usePayload from "./usePayload"
const useEmailAddress = (): EmailAddress | null => {
    const { sub } = usePayload() ?? {}
    return sub ?? null
}
export default useEmailAddress
