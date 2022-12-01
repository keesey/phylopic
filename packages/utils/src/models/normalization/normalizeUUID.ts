import { EMPTY_UUID } from "../constants/EMPTY_UUID"
import { UUIDish } from "../types/UUIDish"
export const normalizeUUID = (uuid?: UUIDish) => (typeof uuid === "string" ? uuid.toLowerCase() : EMPTY_UUID)
export default normalizeUUID
