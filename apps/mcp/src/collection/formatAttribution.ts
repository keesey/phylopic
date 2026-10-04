import type { ImageWithLicenseLink } from "@phylopic/api-models"
import { compareStrings, isPublicDomainLicenseURL, stringifyNomen, type Nomen } from "@phylopic/utils"

export type ImageForAttribution = ImageWithLicenseLink & {
    attribution?: string
    _embedded?: { specificNode?: { names: readonly Nomen[] } }
}

const contains = (nomina: readonly Nomen[], nomen: Nomen) => {
    const json = JSON.stringify(nomen)
    return nomina.some(n => JSON.stringify(n) === json)
}

const formatNomina = (nomina: readonly Nomen[]) => {
    if (!nomina.length) {
        return ""
    }
    return ` (${nomina.map(n => stringifyNomen(n)).join(", ")})`
}

/** Plain-text attribution block matching the www collection usage page. */
export const formatCollectionAttribution = (images: readonly ImageForAttribution[]): string => {
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
    const attributionEntries = Object.entries(record).sort((a, b) => compareStrings(a[0], b[0]))
    const numAttributions = attributionEntries.length
    const hasAttributions = numAttributions > 0

    if (!attributionRequired && !hasAttributions) {
        return "Attribution is not required."
    }
    if (attributionRequired && !hasAttributions) {
        return "Attribution must be given to Anonymous."
    }

    const prefix = `Attribution is ${attributionRequired ? "" : "not "}required, ${
        attributionRequired ? "and" : "but"
    } may be given as:`

    const byParts: string[] = []
    attributionEntries.forEach(([attribution, nomina], index, array) => {
        let part = ""
        if (index > 0 && array.length + (unattributed.length > 0 ? 1 : 0) > 2) {
            part += separator
        } else if (index > 0 && unattributed.length === 0 && index === array.length - 1) {
            part += " and "
        } else if (index > 0) {
            part += " "
        }
        part += attribution
        if (numAttributions > 1 || unattributed.length > 0) {
            part += formatNomina(nomina)
        }
        byParts.push(part)
    })

    let quote = `Silhouette image${images.length === 1 ? "" : "s"} ${images.length === 1 ? "is" : "are"} by ${byParts.join("")}`
    if (unattributed.length > 0) {
        quote += `${numAttributions >= 2 ? separator : ""} and others${formatNomina(unattributed)}`
    }
    quote += "."

    return `${prefix}\n${quote}`
}

export const imageSetAttributionRequired = (images: readonly ImageForAttribution[]) =>
    images.some(image => !isPublicDomainLicenseURL(image._links.license.href))
