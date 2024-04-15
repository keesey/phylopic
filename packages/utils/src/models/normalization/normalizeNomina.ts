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
const isUncited = (nomen: Nomen) => nomen.length === 1 && nomen[0].class === "scientific"
const isCited = (nomen: Nomen) => nomen.length >= 2 && nomen[0].class === "scientific" && nomen[1].class === "citation"
const isUncitedSynonymOfNomen = (scientificText: string, nomen: Nomen) => {
    if (isCited(nomen)) {
        return nomen[0].text === scientificText
    }
    return false
}
const isUncitedSynonym = (nomen: Nomen, nomina: readonly Nomen[]) => {
    if (isUncited(nomen)) {
        return nomina.some(otherNomen => isUncitedSynonymOfNomen(nomen[0].text, otherNomen))
    }
    return false
}
const findCitedSynonyms = (scientificText: string, nomina: readonly Nomen[]) => {
    return nomina.filter(nomen => isCited(nomen) && nomen[0].text === scientificText)
}
export const normalizeNomina = (nomina: readonly Nomen[]) => {
    if (nomina.length <= 1) {
        return nomina
    }
    const normalized = Array.from(
        new Set<string>(
            nomina
                .map(normalizeNomen)
                .filter(nomen => nomen.length > 0 && nomen[0].text)
                .map(stringifyNormalized),
        ),
    )
        .map(json => JSON.parse(json) as Nomen)
        .sort(createCanonicalNameComparator(nomina[0]))
        .filter((nomen, index, nomina) => index === 0 || !isUncitedSynonym(nomen, nomina))
    if (isUncited(normalized[0])) {
        const cited = findCitedSynonyms(normalized[0][0].text, normalized)
        if (cited.length === 1) {
            return [cited[0], ...normalized.filter(n => n !== normalized[0] && n !== cited[0])]
        }
    }
    return normalized
}
