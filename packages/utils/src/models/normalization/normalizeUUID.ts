import { UUID } from "../types/UUID.js"
export const normalizeUUID = (uuid?: UUID) =>
    typeof uuid === "string" ? uuid.toLowerCase() : "00000000-0000-0000-0000-000000000000"
export default normalizeUUID
