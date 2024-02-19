import { extractPath } from "."
import { isUUIDv4 } from "../models"
export const extractUUIDv4 = (href?: string) => {
    if (!href) {
        return null
    }
    const path = extractPath(href)
    const uuid = path.split(/\//g).filter(Boolean).pop()
    if (isUUIDv4(uuid)) {
        return uuid
    }
    return null
}
export default extractUUIDv4
