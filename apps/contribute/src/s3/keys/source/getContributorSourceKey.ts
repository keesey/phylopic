import { normalizeUUID, UUID } from "@phylopic/utils"
const getContributorSourceKey = (uuid: UUID) => `contributors/${encodeURIComponent(normalizeUUID(uuid))}/meta.json`
export default getContributorSourceKey
