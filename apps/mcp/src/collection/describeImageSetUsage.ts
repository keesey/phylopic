import { getCombinedLicenseUrl } from "@phylopic/api-models"
import {
    formatCollectionAttribution,
    formatImageSetAttributionQuote,
    imageSetAttributionRequired,
    type ImageForAttribution,
} from "./formatAttribution.js"

export type ImageSetUsage = {
    attributionRequired: boolean
    /** Www collection usage page wording (includes required/optional preamble). */
    attributionText: string
    /** Diagram footer: quote only when attribution is required; otherwise null. */
    attributionQuote: string | null
    combinedLicenseUrl: string
    imageCount: number
}

export const describeImageSetUsage = (images: readonly ImageForAttribution[]): ImageSetUsage => ({
    attributionRequired: imageSetAttributionRequired(images),
    attributionText: formatCollectionAttribution(images),
    attributionQuote: formatImageSetAttributionQuote(images),
    combinedLicenseUrl: getCombinedLicenseUrl(images),
    imageCount: images.length,
})
