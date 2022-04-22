import { EntityParameters, ListParameters } from "phylopic-api-models/src/queryParameters"
import APIError from "../errors/APIError"
const isValidEmbedField = (value: unknown, validEmbedValues: readonly string[]): value is string => {
    return typeof value === "string" && validEmbedValues.includes(value)
}
const checkListRedirect = <TEmbedded>(
    parameters: ListParameters<TEmbedded>,
    entityEmbedFields: ReadonlyArray<string & keyof EntityParameters<TEmbedded>> = [],
    userMessage = "There was a problem with a request for data.",
): parameters is ListParameters<TEmbedded> &
    Readonly<{ build: undefined }> &
    Readonly<Record<string, string | number | boolean | undefined>> => {
    const { build, page } = parameters
    if (!build) {
        if (page) {
            throw new APIError(400, [
                {
                    developerMessage:
                        "Cannot pass `page` without also specifying a build. You may omit `page`` to find the latest build. Or, check the body of this response.",
                    field: "build",
                    type: "BAD_REQUEST_PARAMETERS",
                    userMessage,
                },
            ])
        }
        return true
    }
    const embedFields = Object.keys(parameters)
        .filter(value => value.startsWith("embed_"))
        .sort()
    if (embedFields.length) {
        if (!page) {
            throw new APIError(
                400,
                embedFields.map(field => ({
                    developerMessage: `The \`${field}\` parameter may only be included if the \`page\` parameter is included.`,
                    field,
                    type: "BAD_REQUEST_PARAMETERS",
                    userMessage,
                })),
            )
        }
        const validEmbedFields = [...entityEmbedFields, "embed_items"].sort()
        const invalidEmbedFields = embedFields.filter(value => !isValidEmbedField(value, validEmbedFields))
        if (invalidEmbedFields.length) {
            throw new APIError(
                400,
                invalidEmbedFields.map(field => ({
                    developerMessage: `Unrecognized embed parameter: \`${field}\`.`,
                    field,
                    type: "BAD_REQUEST_PARAMETERS",
                    userMessage,
                })),
            )
        }
    }
    return false
}
export default checkListRedirect
