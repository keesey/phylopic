import { isUUID } from "@phylopic/utils"
import Payload from "./Payload"
const isPayload = (x: unknown): x is Payload => {
    if (!x || typeof x !== "object" || Object.keys(x).length > 1 || !isUUID((x as Payload).uuid)) {
        return false
    }
    return true
}
export default isPayload
