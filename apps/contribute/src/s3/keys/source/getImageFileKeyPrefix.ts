import { normalizeUUID, UUID } from "@phylopic/utils"
const getImageFileKeyPrefix = (uuid: UUID) => `images/${encodeURIComponent(normalizeUUID(uuid))}/source.`
export default getImageFileKeyPrefix
