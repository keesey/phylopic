import { Image } from "@phylopic/source-models"
import normalizeBoolean from "./normalizeBoolean"
import normalizeEntity from "./normalizeEntity"
const normalizeImage = <T extends Image>(value: T): T => {
    return {
        ...normalizeEntity(value),
        accepted: normalizeBoolean(value.accepted),
        submitted: normalizeBoolean(value.submitted),
    }
}
export default normalizeImage
