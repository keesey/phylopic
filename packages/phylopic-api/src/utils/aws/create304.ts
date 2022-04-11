import type { APIGatewayProxyResult } from "aws-lambda"
const create304 = () =>
    ({
        body: "",
        statusCode: 304,
    } as APIGatewayProxyResult)
export default create304
