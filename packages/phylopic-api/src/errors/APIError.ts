import type { Error as ErrorModel } from "phylopic-api-models/dist/types/Error"
export default class APIError extends Error {
    constructor(
        public readonly httpCode: number,
        public readonly data: readonly ErrorModel[],
        public readonly additionalHeaders: { [name: string]: string | number | boolean } = {},
    ) {
        super(data?.[0]?.developerMessage ?? "Unknown error.")
    }
}
