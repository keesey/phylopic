import type { Error as ErrorData } from "phylopic-api-types"
export default class APIError extends Error {
    constructor(
        public readonly httpCode: number,
        public readonly data: readonly ErrorData[],
        public readonly additionalHeaders: { [name: string]: string | number | boolean } = {},
    ) {
        super(data?.[0]?.developerMessage ?? "Unknown error.")
    }
}
