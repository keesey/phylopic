import { validateBoolean } from "."
import { ImageEmbedded } from "../models"
import { ImageListParameters } from "../queryParameters/ImageListParameters"
import validateEmailAddress from "./validateEmailAddress"
import { validateListParameters } from "./validateListParameters"
import validateUUIDv4 from "./validateUUIDv4"
import { ValidationFault } from "./ValidationFault"
import VALID_IMAGE_EMBEDS from "./VALID_IMAGE_EMBEDS"
const LICENSE_FIELDS: ReadonlyArray<keyof ImageListParameters> = ["license_by", "license_nc", "license_sa"]
export const validateImageListParameters = (parameters: ImageListParameters): readonly ValidationFault[] => {
    let faults = validateListParameters<ImageEmbedded>(parameters, VALID_IMAGE_EMBEDS)
    if (typeof parameters.clade === "string") {
        if (typeof parameters.name === "string" || typeof parameters.node === "string") {
            const field = parameters.name ? "name" : "node"
            faults = [
                ...faults,
                {
                    field,
                    message: `Cannot use "${field}" and "clade" in the same query.`,
                },
            ]
        }
        faults = [...faults, ...validateUUIDv4(parameters.clade, "clade")]
    }
    for (const field of LICENSE_FIELDS) {
        if (typeof parameters[field] === "string") {
            faults = [...faults, ...validateBoolean(parameters[field], field, "license filter value")]
        }
    }
    if (typeof parameters.contributor === "string") {
        faults = [...faults, ...validateEmailAddress(parameters.contributor, "contributor")]
    }
    if (typeof parameters.node === "string") {
        if (typeof parameters.name === "string") {
            faults = [
                ...faults,
                {
                    field: "name",
                    message: `Cannot use "name" and "node" in the same query.`,
                },
            ]
        }
        faults = [...faults, ...validateUUIDv4(parameters.node, "node")]
    }
    return faults
}
export default validateImageListParameters
