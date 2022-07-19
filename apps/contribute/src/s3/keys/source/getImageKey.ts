import { UUID } from "@phylopic/utils"
const getImageKey = (uuid: UUID) => `images/${encodeURIComponent(uuid)}/meta.json`
export default getImageKey
