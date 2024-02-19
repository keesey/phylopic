import { ObjectID } from "@phylopic/utils"
import fetchField from "./fetchField"
import getAgeUrl from "./getAgeUrl"
const getAge = async (ncbiTaxIDs: Iterable<string>) => {
    const result = await fetchField(getAgeUrl(Array.from(ncbiTaxIDs).sort()))
    if (typeof result === "string") {
        const n = parseFloat(result)
        if (isFinite(n)) {
            return Math.max(0, n) * 1000000
        }
    }
    return null
}
export default getAge
