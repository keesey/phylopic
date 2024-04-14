import { ISOTimestamp } from "@phylopic/utils"
import { normalizeISOTimestamp } from "./normalizeISOTimestamp"
export const normalizeEntity = <T extends { created: ISOTimestamp; modified: ISOTimestamp }>(entity: T): T => {
    return {
        ...entity,
        created: normalizeISOTimestamp(entity.created),
        modified: normalizeISOTimestamp(entity.modified),
    }
}
