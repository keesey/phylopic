import { isUUID, UUID } from "@phylopic/utils"
const extractUUIDFromSubmissionKey = (key: string | null): UUID | null => {
    const match = decodeURIComponent(key?.match(/^.+\/([0-9a-f-]+)\/meta\.json$/)?.[1] ?? "")
    return isUUID(match) ? match : null
}
export default extractUUIDFromSubmissionKey
