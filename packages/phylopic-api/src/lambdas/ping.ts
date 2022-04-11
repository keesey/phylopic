import type { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
const RESULT: APIGatewayProxyResult = {
    body: "",
    statusCode: 204,
}
const PROMISE = Promise.resolve(RESULT)
export const onAPIGatewayProxy: APIGatewayProxyHandler = () => PROMISE
