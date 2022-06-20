import { EmailAddress, normalizeUUID, UUID } from "@phylopic/utils"
const getContributorTokenKey = (email: EmailAddress, jti: UUID) =>
    `contributors/${encodeURIComponent(email)}/auth/${encodeURIComponent(normalizeUUID(jti))}.jwt`
export default getContributorTokenKey
