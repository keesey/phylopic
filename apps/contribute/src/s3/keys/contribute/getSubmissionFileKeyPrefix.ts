import { normalizeUUID, UUID } from "@phylopic/utils"
const getSubmissionFileKeyPrefix = (uuid: UUID) => `submissionfiles/${encodeURIComponent(normalizeUUID(uuid))}/source.`
export default getSubmissionFileKeyPrefix
