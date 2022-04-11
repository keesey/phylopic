import {
    isImageMediaType,
    isLicenseURL,
    isNormalizedText,
    isRasterMediaType,
    isVectorMediaType,
} from "phylopic-utils/src/models"
import isURL from "phylopic-utils/src/models/detection/isURL"
import { isString, isTypeOrUndefined } from "phylopic-utils/src/types"
import { Image } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinkArray from "./isLinkArray"
import isLinkOrNull from "./isLinkOrNull"
import isLinks from "./isLinks"
import isMediaLink from "./isMediaLink"
import isMediaLinkArray from "./isMediaLinkArray"
const isImageLinks = (x: unknown): x is Image["_links"] =>
    isLinks(x) &&
    isLink((x as Image["_links"]).contributor, isString) &&
    isLinkOrNull((x as Image["_links"]).generalNode, isString) &&
    isLink((x as Image["_links"])["http://ogp.me/ns#image"], isURL) &&
    isLink((x as Image["_links"]).license, isLicenseURL) &&
    isLinkArray((x as Image["_links"]).nodes, isString) &&
    isMediaLinkArray((x as Image["_links"]).rasterFiles, isURL, isRasterMediaType) &&
    isMediaLink((x as Image["_links"]).sourceFile, isURL, isImageMediaType) &&
    isLink((x as Image["_links"]).specificNode, isString) &&
    isMediaLinkArray((x as Image["_links"]).thumbnailFiles, isURL, isRasterMediaType) &&
    isLink((x as Image["_links"])["twitter:image"], isURL) &&
    isMediaLink((x as Image["_links"]).vectorFile, isURL, isVectorMediaType)
export const isImage = (x: unknown): x is Image =>
    isEntity(x, isImageLinks) &&
    isNormalizedText((x as Image).attribution) &&
    isTypeOrUndefined((x as Image).sponsor, isNormalizedText)
export default isImage
