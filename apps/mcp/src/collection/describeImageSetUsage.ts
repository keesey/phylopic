import { combinedLicenseUrl } from "./combinedLicense.js"
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
    combinedLicenseUrl: combinedLicenseUrl(images),
    imageCount: images.length,
})
