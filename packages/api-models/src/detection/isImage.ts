import {
    isArray,
    isImageMediaType,
    isLicenseURL,
    isNormalizedText,
    isNullOr,
    isRasterMediaType,
    isTag,
    isTrue,
    isUndefinedOr,
    isURL,
    isVectorMediaType,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { Image } from "../types/Image"
import { isEntity } from "./isEntity"
import { isLink } from "./isLink"
import { isLinks } from "./isLinks"
import { isMediaLink } from "./isMediaLink"
import { isTitledLink } from "./isTitledLink"
const isImageLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image["_links"] =>
    isLinks(x, isTitledLink(isNormalizedText), faultCollector) &&
    isTitledLink(isNormalizedText)((x as Image["_links"]).contributor, faultCollector?.sub("contributor")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Image["_links"]).generalNode, faultCollector?.sub("general")) &&
    isLink(isURL)((x as Image["_links"])["http://ogp.me/ns#image"], faultCollector?.sub("http://ogp.me/ns#image")) &&
    isLink(isLicenseURL)((x as Image["_links"]).license, faultCollector?.sub("license")) &&
    isArray(isTitledLink(isNormalizedText))((x as Image["_links"]).nodes, faultCollector?.sub("nodes")) &&
    isArray(isMediaLink(isURL, isRasterMediaType))(
        (x as Image["_links"]).rasterFiles,
        faultCollector?.sub("rasterFiles"),
    ) &&
    isMediaLink(isURL, isImageMediaType)((x as Image["_links"]).sourceFile, faultCollector?.sub("sourceFile")) &&
    isTitledLink(isNormalizedText)((x as Image["_links"]).specificNode, faultCollector?.sub("specificNode")) &&
    isArray(isMediaLink(isURL, isRasterMediaType))(
        (x as Image["_links"]).thumbnailFiles,
        faultCollector?.sub("thumbnailFiles"),
    ) &&
    // :TODO: Remove this line
    isUndefinedOr(isLink(isURL))((x as Image["_links"])["twitter:image"], faultCollector?.sub("twitter:image")) &&
    isMediaLink(isURL, isVectorMediaType)((x as Image["_links"]).vectorFile, faultCollector?.sub("vectorFile"))
export const isImage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Image =>
    isEntity(x, isImageLinks, faultCollector) &&
    isNullOr(isNormalizedText)((x as Image).attribution, faultCollector?.sub("attribution")) &&
    // :TODO: Add validation for modified and modifiedFile
    isNullOr(isNormalizedText)((x as Image).sponsor, faultCollector?.sub("sponsor")) &&
    isArray(isTag)((x as Image).tags, faultCollector?.sub("tags")) &&
    isUndefinedOr(isTrue)((x as Image).unlisted, faultCollector?.sub("unlisted"))
