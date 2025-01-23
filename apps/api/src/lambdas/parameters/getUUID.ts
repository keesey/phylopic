import { normalizeUUID } from "@phylopic/utils"
import { APIGatewayProxyEventPathParameters } from "aws-lambda"
import getParameters from "./getParameters"
export const getUUID = (pathParameters: APIGatewayProxyEventPathParameters | null) => {
    const { uuid } = getParameters<{ uuid: string }>(pathParameters, ["uuid"])
    return { uuid: normalizeUUID(uuid) }
}
export default getUUID
