import { EntityParameters } from "../queryParameters/EntityParameters"
import validateDataParameters from "./validateDataParameters"
import validateEmbedParameters from "./validateEmbedParameters"
import validateUUIDv4 from "./validateUUIDv4"
import { ValidationFault } from "./ValidationFault"
export const validateEntityParameters = <TEmbedded>(
    parameters: EntityParameters<TEmbedded>,
    validEmbeds: Iterable<string & keyof TEmbedded>,
): readonly ValidationFault[] => {
    return [
        ...validateDataParameters(parameters),
        ...validateUUIDv4(parameters.uuid, "uuid"),
        ...validateEmbedParameters<TEmbedded>(parameters, validEmbeds),
    ]
}
export default validateEntityParameters
