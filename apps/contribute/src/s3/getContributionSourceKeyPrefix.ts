import { normalizeUUID, UUID } from "@phylopic/utils"
const getContributionSourceKeyPrefix = (uuid: UUID) =>
    `contributions/${encodeURIComponent(normalizeUUID(uuid))}/source.`
export default getContributionSourceKeyPrefix
