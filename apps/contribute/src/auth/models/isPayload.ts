import { isUUID } from "@phylopic/utils"
import Payload from "./Payload"
const isPayload = (x: unknown): x is Payload => {
    if (!x || typeof x !== "object" || !isUUID((x as Payload).uuid)) {
        return false
    }
    return true
}
export default isPayload
