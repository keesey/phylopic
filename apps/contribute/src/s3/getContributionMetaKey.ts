import { normalizeUUID, UUID } from "@phylopic/utils"
const getContributionMetaKey = (uuid: UUID) => `contributions/${encodeURIComponent(normalizeUUID(uuid))}/meta.json`
export default getContributionMetaKey
