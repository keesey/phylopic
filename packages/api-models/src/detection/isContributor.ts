import { isNormalizedText, isNullOr } from "@phylopic/utils/dist/detection"
import { isEmailAddress } from "@phylopic/utils/dist/models/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { invalidate } from "@phylopic/utils/dist/validation"
import { Contributor } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinks from "./isLinks"
const isMailToHRef = (x: unknown, faultCollector?: ValidationFaultCollector): x is string =>
    (typeof x === "string" && x.startsWith("mailto:") && isEmailAddress(x.slice("mailto:".length))) ||
    invalidate(faultCollector, "Not a valid `mailto:` link.")
const isContributorLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contributor["_links"] =>
    isLinks(x, faultCollector) &&
    isNullOr(isLink(isMailToHRef))((x as Contributor["_links"]).contact, faultCollector?.sub("contact")) &&
    isLink(isNormalizedText)((x as Contributor["_links"]).images, faultCollector?.sub("images"))
export const isContributor = (x: unknown, faultCollector?: ValidationFaultCollector): x is Contributor =>
    isEntity(x, isContributorLinks, faultCollector) &&
    isNormalizedText((x as Contributor).name, faultCollector?.sub("name"))
export default isContributor
