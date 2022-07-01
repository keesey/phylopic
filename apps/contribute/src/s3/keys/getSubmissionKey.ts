import { EmailAddress, normalizeUUID, UUID } from "@phylopic/utils"
const getSubmissionKey = (email: EmailAddress, uuid: UUID) =>
    `contributors/${encodeURIComponent(email)}/submissions/${encodeURIComponent(normalizeUUID(uuid))}.json`
export default getSubmissionKey
