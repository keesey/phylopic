import { ListParameters } from "../queryParameters/ListParameters"
import validateDataParameters from "./validateDataParameters"
import validateEmbedParameters from "./validateEmbedParameters"
import { ValidationFault } from "./ValidationFault"
export const validateListParameters = <TEmbedded>(
    parameters: ListParameters<TEmbedded>,
    validEmbeds: Iterable<string & keyof TEmbedded>,
) => {
    const faults: ValidationFault[] = [
        ...validateDataParameters(parameters),
        ...validateEmbedParameters<TEmbedded>(parameters, validEmbeds),
    ]
    const embeds = Object.keys(parameters).filter(parameter => parameter.startsWith("embed_"))
    if (embeds.length > 0 && !parameters.page) {
        faults.push(
            ...embeds.map<ValidationFault>(field => ({
                field,
                message: `Cannot include \`${field}\` unless \`page\` is present.`,
            })),
        )
    }
    if (parameters.page) {
        const n = parseInt(parameters.page, 10)
        if (!isFinite(n) || n < 0) {
            faults.push({
                field: "build",
                message: "Page index must be a nonnegative integer.",
            })
        }
    }
    return faults as readonly ValidationFault[]
}
