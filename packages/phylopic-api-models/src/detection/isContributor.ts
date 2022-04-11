import { isEmailAddress, isNormalizedText } from "phylopic-utils/src/models"
import { isPositiveInteger, isString } from "phylopic-utils/src/types"
import { Contributor } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinkOrNull from "./isLinkOrNull"
import isLinks from "./isLinks"
const isMailToHRef = (x: unknown): x is string =>
    typeof x === "string" && x.startsWith("mailto:") && isEmailAddress(x.slice("mailto:".length))
const isContributorLinks = (x: unknown): x is Contributor["_links"] =>
    isLinks(x) &&
    isLinkOrNull((x as Contributor["_links"]).email, isMailToHRef) &&
    isLink((x as Contributor["_links"]).images, isString)
export const isContributor = (x: unknown): x is Contributor =>
    isEntity(x, isContributorLinks) &&
    isPositiveInteger((x as Contributor).count) &&
    isNormalizedText((x as Contributor).name)
export default isContributor
