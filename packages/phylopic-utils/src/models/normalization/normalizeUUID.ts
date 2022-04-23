import { UUID } from "../types/UUID"
export const normalizeUUID = (uuid?: UUID) =>
    typeof uuid === "string" ? uuid.toLowerCase() : "00000000-0000-0000-0000-000000000000"
