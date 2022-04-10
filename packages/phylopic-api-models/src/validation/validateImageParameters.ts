import { ImageEmbedded } from "../models"
import { EntityParameters } from "../queryParameters/EntityParameters"
import validateEntityParameters from "./validateEntityParameters"
const VALID_EMBEDS: ReadonlySet<keyof ImageEmbedded> = new Set(["generalNode", "nodes", "specificNode"])
export const validateImageParameters = (parameters: EntityParameters<ImageEmbedded>) => {
    return validateEntityParameters(parameters, VALID_EMBEDS)
}
export default validateImageParameters
