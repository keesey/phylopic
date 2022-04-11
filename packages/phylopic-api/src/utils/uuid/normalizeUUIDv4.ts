import { v4 } from "is-uuid"
import APIError from "../../errors/APIError"
export const normalizeUUIDv4 = (uuid: string | undefined, typeLabel: string) => {
    if (!uuid || !v4(uuid)) {
        throw new APIError(404, [
            {
                developerMessage: `Not a valid UUID v4: "${uuid}".`,
                field: "uuid",
                type: "RESOURCE_NOT_FOUND",
                userMessage: `Invalid request for ${typeLabel}.`,
            },
        ])
    }
    return uuid.toLowerCase()
}
export default normalizeUUIDv4
