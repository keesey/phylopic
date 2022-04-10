import { EmbeddableParameters } from "../queryParameters/EmbeddableParameters"
import { ValidationFault } from "./ValidationFault"
export const validateEmbedParameters = <TEmbedded>(
    parameters: EmbeddableParameters<TEmbedded>,
    validEmbeds: Iterable<string & keyof TEmbedded>,
) => {
    const faults: ValidationFault[] = []
    const embeds = Object.keys(parameters).filter(parameter => parameter.startsWith("embed_"))
    if (embeds.length) {
        const validEmbedSet = new Set<string>(validEmbeds)
        const invalidEmbeds = embeds.filter(embed => !validEmbedSet.has(embed)).sort()
        if (invalidEmbeds.length) {
            faults.push({
                field: "embed",
                message: `Unrecognized propert${invalidEmbeds.length === 1 ? "y" : "ies"}: "${invalidEmbeds.join(
                    '", "',
                )}".`,
            })
        }
    }
    return faults as readonly ValidationFault[]
}
export default validateEmbedParameters
