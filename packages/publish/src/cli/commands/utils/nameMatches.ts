import { Nomen, shortenNomen, stringifyNomen } from "@phylopic/utils"
const nameMatches = (s: string, name: Nomen, caseInsensitive?: boolean): boolean => {
    const full = stringifyNomen(name)
    if (caseInsensitive ? s.toLowerCase() === full.toLowerCase() : s === full) {
        return true
    }
    const short = stringifyNomen(shortenNomen(name))
    if (caseInsensitive ? s.toLowerCase() === short.toLowerCase() : s === short) {
        return true
    }
    return false
}
export default nameMatches
