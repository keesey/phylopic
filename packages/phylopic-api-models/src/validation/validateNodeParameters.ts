import { NodeEmbedded } from "../types"
import { EntityParameters } from "../queryParameters/EntityParameters"
import validateEntityParameters from "./validateEntityParameters"
const VALID_EMBEDS: ReadonlySet<keyof NodeEmbedded> = new Set(["childNodes", "parentNode", "primaryImage"])
export const validateNodeParameters = (parameters: EntityParameters<NodeEmbedded>) => {
    return validateEntityParameters(parameters, VALID_EMBEDS)
}
export default validateNodeParameters
