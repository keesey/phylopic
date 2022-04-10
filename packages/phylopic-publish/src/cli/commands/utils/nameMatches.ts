import { Name } from "phylopic-source-models/src"
import nameToText from "./nameToText"
const nameMatches = (s: string, name: Name, caseInsensitive?: boolean): boolean => {
    const full = nameToText(name)
    if (caseInsensitive ? s.toLowerCase() === full.toLowerCase() : s === full) {
        return true
    }
    const short = nameToText(name, true)
    if (caseInsensitive ? s.toLowerCase() === short.toLowerCase() : s === short) {
        return true
    }
    return false
}
export default nameMatches
