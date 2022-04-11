import { APIGatewayProxyEventPathParameters } from "aws-lambda"
import getParameters from "./getParameters"
export const getUUID = (pathParameters: APIGatewayProxyEventPathParameters | null) => {
    const { uuid } = getParameters<{ uuid: string }>(pathParameters, ["uuid"])
    if (uuid) {
        return { uuid: uuid.toLowerCase() }
    }
    return {}
}
export default getUUID
