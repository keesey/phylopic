import fetchField from "./fetchField.js"
import getAgeUrl from "./getAgeUrl.js"
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
