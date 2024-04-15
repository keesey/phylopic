import { NomenPart } from "parse-nomen"
import { stringifyNormalized } from "../../json/stringifyNormalized"
import { stringifyNomen } from "../../nomina/stringifyNomen"
import { Nomen } from "../types/Nomen"
import { normalizeNomen } from "./normalizeNomen"
const compare = (a: Nomen, b: Nomen) => {
    if (a === b) {
        return 0
    }
    const aText = stringifyNomen(a)
    const bText = stringifyNomen(b)
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
const createCanonicalNameComparator = (canonical: Nomen | undefined) => {
    const canonicalJSON = canonical ? stringifyNormalized(normalizeNomen(canonical)) : ""
    return (a: Nomen, b: Nomen) => {
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
        return compare(a, b)
    }
}
const isUncitedSynonymOfNomen = (scientificText: string, nomen: Nomen) => {
    if (nomen.length >= 2 && nomen[0].class === "scientific" && nomen[1].class === "citation") {
        return nomen[0].text === scientificText
    }
    return false
}
const isUncitedSynonym = (nomen: Nomen, nomina: readonly Nomen[]) => {
    if (nomen.length === 1 && nomen[0].class === "scientific") {
        return nomina.some(otherNomen => isUncitedSynonymOfNomen(nomen[0].text, otherNomen))
    }
    return false
}
export const normalizeNomina = (nomina: readonly Nomen[]) => {
    if (nomina.length <= 1) {
        return nomina
    }
    return Array.from(
        new Set<string>(
            nomina
                .map(normalizeNomen)
                .filter(nomen => nomen.length > 0 && nomen[0].text)
                .map(stringifyNormalized),
        ),
    )
        .map(json => JSON.parse(json) as Nomen)
        .filter((nomen, index, nomina) => index === 0 || !isUncitedSynonym(nomen, nomina))
        .sort(createCanonicalNameComparator(nomina[0]))
}
