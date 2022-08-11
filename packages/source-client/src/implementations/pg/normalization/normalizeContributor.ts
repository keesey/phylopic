import { Contributor } from "@phylopic/source-models"
import normalizeBoolean from "./normalizeBoolean"
import normalizeEntity from "./normalizeEntity"
const normalizeContributor = <T extends Contributor>(value: T): T => {
    return {
        ...normalizeEntity(value),
        showEmailAddress: normalizeBoolean(value.showEmailAddress),
    }
}
export default normalizeContributor
