import { isNormalizedText, isUUIDish, ValidationFaultCollector } from "@phylopic/utils"
import { Collection } from "../types/Collection"
import isLink from "./isLink"
import isLinks from "./isLinks"
const isCollectionLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Collection["_links"] =>
    isLinks(x) &&
    isLink(isNormalizedText)((x as Collection["_links"]).contributors, faultCollector?.sub("contributors")) &&
    isLink(isNormalizedText)((x as Collection["_links"]).images, faultCollector?.sub("images")) &&
    isLink(isNormalizedText)((x as Collection["_links"]).nodes, faultCollector?.sub("nodes"))
export const isCollection = (x: unknown, faultCollector?: ValidationFaultCollector): x is Collection =>
    isCollectionLinks((x as Collection)._links, faultCollector?.sub("_links")) &&
    isUUIDish((x as Collection).uuid, faultCollector?.sub("uuid"))
export default isCollection
