import Payload from "./Payload"
const isPayload = (x: unknown): x is Payload => {
    if (!x || typeof x !== "object" || Object.keys(x).length > 1 || typeof (x as Payload).name !== "string") {
        return false
    }
    return true
}
export default isPayload
