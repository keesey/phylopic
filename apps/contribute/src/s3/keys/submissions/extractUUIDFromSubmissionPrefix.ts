import { isUUID, UUID } from "@phylopic/utils"
const extractUUIDFromSubmissionPrefix = (key: string | null): UUID | null => {
    const match = decodeURIComponent(key?.match(/^.+\/([0-9a-f-]+)\/$/)?.[1] ?? "")
    return isUUID(match) ? match : null
}
export default extractUUIDFromSubmissionPrefix
