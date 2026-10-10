import { aggregateToQuote, buildAttributionAggregate, type ImageForAttribution } from "./formatAttributionAggregate.js"
import { isPublicDomainLicenseURL } from "@phylopic/utils"

export type { ImageForAttribution } from "./formatAttributionAggregate.js"

/** Plain-text attribution block matching the www collection usage page. */
export const formatCollectionAttribution = (images: readonly ImageForAttribution[]): string => {
    const agg = buildAttributionAggregate(images)
    const quote = aggregateToQuote(agg, false)

    if (!agg.attributionRequired && !agg.hasAttributions) {
        return "Attribution is not required."
    }
    if (agg.attributionRequired && !agg.hasAttributions) {
        return "Attribution must be given to Anonymous."
    }

    const prefix = `Attribution is ${agg.attributionRequired ? "" : "not "}required, ${
        agg.attributionRequired ? "and" : "but"
    } may be given as:`

    return `${prefix}\n${quote}`
}

/** Full attribution quote for metadata (includes citation text in nomina). */
export const formatImageSetAttributionQuote = (images: readonly ImageForAttribution[]): string | null => {
    const agg = buildAttributionAggregate(images)
    if (!agg.attributionRequired) {
        return null
    }
    return aggregateToQuote(agg, false)
}

export const imageSetAttributionRequired = (images: readonly ImageForAttribution[]) =>
    images.some(image => !isPublicDomainLicenseURL(image._links.license.href))
