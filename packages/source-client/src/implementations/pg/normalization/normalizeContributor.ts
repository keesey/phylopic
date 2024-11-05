import { Contributor } from "@phylopic/source-models"
import { normalizeBoolean } from "./normalizeBoolean"
import { normalizeEntity } from "./normalizeEntity"
export const normalizeContributor = <T extends Contributor>(value: T): T => {
    return {
        ...normalizeEntity(value),
        showEmailAddress: normalizeBoolean(value.showEmailAddress),
    }
}
