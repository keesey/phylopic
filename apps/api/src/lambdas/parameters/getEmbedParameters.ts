import type { APIGatewayProxyEventQueryStringParameters } from "aws-lambda"
const getEmbedParameters = <T extends string>(
    parameters: APIGatewayProxyEventQueryStringParameters | null,
    embeddedParameters: readonly T[],
) => {
    if (!parameters) {
        return {} as Record<T, never>
    }
    return embeddedParameters
        .filter(embed => parameters[embed] === "true")
        .reduce((prev, embed) => ({ ...prev, [embed]: "true" }), {} as Record<T, "true">)
}
export default getEmbedParameters
