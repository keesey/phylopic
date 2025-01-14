import { type Image } from "@phylopic/source-models"
import { normalizeBoolean } from "./normalizeBoolean"
import { normalizeEntity } from "./normalizeEntity"
export const normalizeImage = <T extends Image>(value: T): T => {
    return {
        ...normalizeEntity(value),
        unlisted: normalizeBoolean(value.unlisted),
    }
}
