import { isArray, isNormalizedText, isNullOr } from "@phylopic/utils/dist/detection"
import {
    isImageMediaType,
    isLicenseURL,
    isRasterMediaType,
    isURL,
    isVectorMediaType,
} from "@phylopic/utils/dist/models/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { Image } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinks from "./isLinks"
import isMediaLink from "./isMediaLink"
const isImageLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image["_links"] =>
    isLinks(x, faultCollector) &&
    isLink(isNormalizedText)((x as Image["_links"]).contributor, faultCollector?.sub("contributor")) &&
    isNullOr(isLink(isNormalizedText))((x as Image["_links"]).generalNode, faultCollector?.sub("general")) &&
    isLink(isURL)((x as Image["_links"])["http://ogp.me/ns#image"], faultCollector?.sub("http://ogp.me/ns#image")) &&
    isLink(isLicenseURL)((x as Image["_links"]).license, faultCollector?.sub("license")) &&
    isArray(isLink(isNormalizedText))((x as Image["_links"]).nodes, faultCollector?.sub("nodes")) &&
    isArray(isMediaLink(isURL, isRasterMediaType))(
        (x as Image["_links"]).rasterFiles,
        faultCollector?.sub("rasterFiles"),
    ) &&
    isMediaLink(isURL, isImageMediaType)((x as Image["_links"]).sourceFile, faultCollector?.sub("sourceFile")) &&
    isLink(isNormalizedText)((x as Image["_links"]).specificNode, faultCollector?.sub("specificNode")) &&
    isArray(isMediaLink(isURL, isRasterMediaType))(
        (x as Image["_links"]).thumbnailFiles,
        faultCollector?.sub("thumbnailFiles"),
    ) &&
    isLink(isURL)((x as Image["_links"])["twitter:image"], faultCollector?.sub("twitter:image")) &&
    isMediaLink(isURL, isVectorMediaType)((x as Image["_links"]).vectorFile, faultCollector?.sub("vectorFile"))
export const isImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    isEntity(x, isImageLinks, faultCollector) &&
    isNullOr(isNormalizedText)((x as Image).attribution, faultCollector?.sub("attribution")) &&
    isNullOr(isNormalizedText)((x as Image).sponsor, faultCollector?.sub("sponsor"))
export default isImage
