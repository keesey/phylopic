import { createSearch } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import BUILD from "./BUILD"
const createBuildRedirect = (
    path: string,
    query: Readonly<Record<string, string | number | boolean | undefined>> = {},
) => {
    return {
        body: "",
        headers: createRedirectHeaders(
            (path.replace(/\/$/, "") || "/") + createSearch({ ...query, build: BUILD }),
            false,
        ),
        statusCode: 307,
    } as APIGatewayProxyResult
}
export default createBuildRedirect
