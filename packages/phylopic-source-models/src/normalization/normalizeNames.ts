import { Name } from "../models/Name"
import { normalizeName } from "./normalizeName"
import { stringifyNormalized } from "./stringifyNormalized"

const getNameText = (name: Name) => name.map(({ text }) => text).join(" ")
const compareNames = (a: Name, b: Name) => {
    if (a === b) {
        return 0
    }
    const aText = getNameText(a)
    const bText = getNameText(b)
    const aTextLower = aText.toLowerCase()
    const bTextLower = bText.toLowerCase()
    if (aTextLower < bTextLower) {
        return -1
    }
    if (aTextLower > bTextLower) {
        return 1
    }
    if (aText < bText) {
        return -1
    }
    if (aText > bText) {
        return 1
    }
    const aJSON = stringifyNormalized(a)
    const bJSON = stringifyNormalized(b)
    const aJSONLower = aJSON.toLowerCase()
    const bJSONLower = bJSON.toLowerCase()
    if (aJSONLower < bJSONLower) {
        return -1
    }
    if (aJSONLower > bJSONLower) {
        return 1
    }
    if (aJSON < bJSON) {
        return -1
    }
    if (aJSON > bJSON) {
        return 1
    }
    return 0
}
const createCanonicalNameComparator = (canonical: Name | undefined) => {
    const canonicalJSON = canonical ? stringifyNormalized(normalizeName(canonical)) : ""
    return (a: Name, b: Name) => {
        const aIsCanonical = stringifyNormalized(a) === canonicalJSON
        const bIsCanonical = stringifyNormalized(b) === canonicalJSON
        if (aIsCanonical) {
            if (bIsCanonical) {
                return 0
            }
            return -1
        }
        if (bIsCanonical) {
            return 1
        }
        return compareNames(a, b)
    }
}
export const normalizeNames = (names: readonly Name[]) => {
    if (names.length <= 1) {
        return names
    }
    return [
        ...new Set<string>(
            names
                .map(normalizeName)
                .filter(name => name.length > 0 && name[0].text)
                .map(stringifyNormalized),
        ),
    ]
        .map(json => JSON.parse(json) as Name)
        .sort(createCanonicalNameComparator(names[0]))
}
