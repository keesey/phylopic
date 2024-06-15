import { ErrorResponse } from "@phylopic/api-models"
import { isDefined } from "@phylopic/utils"
export class APISWRError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly statusText: string,
        public readonly data?: ErrorResponse,
    ) {
        super(
            data?.errors
                .map(error => error.userMessage)
                .filter(isDefined)
                .join("\n") || statusText,
        )
    }
}
