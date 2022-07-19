import { isUUID, normalizeUUID } from "@phylopic/utils"
const extractUUIDFromSubmissionKey = (key: string) => {
    const parts = key.split("/")
    const uuid = parts[parts.length - 1].split(".", 2)[0]
    return isUUID(uuid) ? normalizeUUID(uuid) : null
}
export default extractUUIDFromSubmissionKey
