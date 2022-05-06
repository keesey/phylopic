import { isUUIDv4 } from "@phylopic/utils"
const extractUUIDv4 = (href?: string) => {
    if (!href) {
        return null
    }
    const [path] = href.split(/[?#]/, 2)
    const uuid = path.split(/\//g).filter(Boolean).pop()
    if (isUUIDv4(uuid)) {
        return uuid
    }
    return null
}
export default extractUUIDv4
