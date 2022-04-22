import type { APIGatewayProxyResult } from "aws-lambda"
export declare type Operation<P, S = undefined> = (
    parameters: P,
    service: S,
    body?: string | undefined,
) => Promise<APIGatewayProxyResult>
