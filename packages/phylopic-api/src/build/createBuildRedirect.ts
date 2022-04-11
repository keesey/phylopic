import { APIGatewayProxyResult } from "aws-lambda"
import createSearch from "../utils/http/createSearch"
import createRedirectHeaders from "../headers/createRedirectHeaders"
import BUILD from "./BUILD"
const createBuildRedirect = (path: string, query: Readonly<Record<string, string | number | boolean | undefined>> = {}) => {
    return {
        body: "",
        headers: createRedirectHeaders(path + createSearch({ ...query, build: BUILD })),
        statusCode: 307,
    } as APIGatewayProxyResult
}
export default createBuildRedirect
