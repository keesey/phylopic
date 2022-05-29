import { extractPath } from "@phylopic/utils"
import resolveExternal from "./resolveExternal"
const resolveExternalHRef = (href: string) => {
    const path = extractPath(href).replace(/^\/resolve\//, "")
    const [authority, namespace, objectID] = path.split("/", 3).map(decodeURIComponent)
    return resolveExternal(authority, namespace, objectID)
}
export default resolveExternalHRef
