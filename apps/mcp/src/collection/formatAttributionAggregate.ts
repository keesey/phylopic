import type { ImageWithLicenseLink } from "@phylopic/api-models"
import {
    compareStrings,
    isPublicDomainLicenseURL,
    shortenNomen,
    stringifyNomen,
    type Nomen,
} from "@phylopic/utils"

export type ImageForAttribution = ImageWithLicenseLink & {
    attribution?: string
    _embedded?: { specificNode?: { names: readonly Nomen[] } }
}

export type AttributionEntry = Readonly<{
    attribution: string
    nomina: readonly Nomen[]
}>

export type AttributionAggregate = Readonly<{
    attributionRequired: boolean
    hasAttributions: boolean
    imageCount: number
    separator: string
    entries: readonly AttributionEntry[]
    unattributed: readonly Nomen[]
}>

const contains = (nomina: readonly Nomen[], nomen: Nomen) => {
    const json = JSON.stringify(nomen)
    return nomina.some(n => JSON.stringify(n) === json)
}

const formatNominaPlain = (nomina: readonly Nomen[], shortNomina: boolean) => {
    if (!nomina.length) {
        return ""
    }
    const label = (n: Nomen) => stringifyNomen(shortNomina ? shortenNomen(n) : n)
    return ` (${nomina.map(label).join(", ")})`
}

export const buildAttributionAggregate = (images: readonly ImageForAttribution[]): AttributionAggregate => {
    const attributionRequired = images.some(image => !isPublicDomainLicenseURL(image._links.license.href))

    const record: Record<string, Nomen[]> = {}
    const unattributed: Nomen[] = []
    for (const image of images) {
        const nomen = image._embedded?.specificNode?.names[0]
        if (image.attribution) {
            if (record[image.attribution]) {
                if (nomen && !contains(record[image.attribution], nomen)) {
                    record[image.attribution] = [...record[image.attribution], nomen].sort((a, b) =>
                        compareStrings(stringifyNomen(a), stringifyNomen(b)),
                    )
                }
            } else {
                record[image.attribution] = nomen ? [nomen] : []
            }
        } else if (nomen) {
            unattributed.push(nomen)
        }
    }
    unattributed.sort((a, b) => compareStrings(stringifyNomen(a), stringifyNomen(b)))

    const separator = Object.keys(record).some(attribution => attribution.indexOf(",") >= 0) ? ";" : ","
    const attributionEntries = Object.entries(record)
        .sort((a, b) => compareStrings(a[0], b[0]))
        .map(([attribution, nomina]) => ({ attribution, nomina }))

    return {
        attributionRequired,
        hasAttributions: attributionEntries.length > 0,
        imageCount: images.length,
        separator,
        entries: attributionEntries,
        unattributed,
    }
}

export const aggregateToQuote = (agg: AttributionAggregate, shortNomina: boolean): string | null => {
    if (!agg.attributionRequired && !agg.hasAttributions) {
        return null
    }
    if (agg.attributionRequired && !agg.hasAttributions) {
        return "Attribution must be given to Anonymous."
    }

    const byParts: string[] = []
    agg.entries.forEach((entry, index, array) => {
        let part = ""
        if (index > 0 && array.length + (agg.unattributed.length > 0 ? 1 : 0) > 2) {
            part += `${agg.separator} `
        } else if (index > 0 && agg.unattributed.length === 0 && index === array.length - 1) {
            part += " and "
        } else if (index > 0) {
            part += " "
        }
        part += entry.attribution
        if (agg.entries.length > 1 || agg.unattributed.length > 0) {
            part += formatNominaPlain(entry.nomina, shortNomina)
        }
        byParts.push(part)
    })

    let quote = `Silhouette image${agg.imageCount === 1 ? "" : "s"} ${agg.imageCount === 1 ? "is" : "are"} by ${byParts.join("")}`
    if (agg.unattributed.length > 0) {
        quote += `${agg.entries.length >= 2 ? `${agg.separator} ` : ""} and others${formatNominaPlain(agg.unattributed, shortNomina)}`
    }
    quote += "."
    return quote
}
