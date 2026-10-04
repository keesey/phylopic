import { getCombinedLicenseUrl } from "@phylopic/api-models"
import {
    formatCollectionAttribution,
    imageSetAttributionRequired,
    type ImageForAttribution,
} from "./formatAttribution.js"

export type ImageSetUsage = {
    attributionRequired: boolean
    attributionText: string
    combinedLicenseUrl: string
    imageCount: number
}

export const describeImageSetUsage = (images: readonly ImageForAttribution[]): ImageSetUsage => ({
    attributionRequired: imageSetAttributionRequired(images),
    attributionText: formatCollectionAttribution(images),
    combinedLicenseUrl: getCombinedLicenseUrl(images),
    imageCount: images.length,
})
