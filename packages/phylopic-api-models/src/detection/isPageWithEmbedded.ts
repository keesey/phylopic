import { FaultDetector, isArray, isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { PageEmbedded } from "~/types/PageWithEmbedded"
import { PageWithEmbedded } from "../types"
import isPage from "./isPage"
const isPageEmbedded =
    <TItem>(isItem: FaultDetector<TItem>): FaultDetector<PageEmbedded<TItem>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is PageEmbedded<TItem> =>
        isObject(x, faultCollector) &&
        isUndefinedOr(isArray(isItem))((x as PageEmbedded<TItem>).items, faultCollector?.sub("items"))
export const isPageWithEmbedded =
    <TItem>(isItem: FaultDetector<TItem>): FaultDetector<PageWithEmbedded<TItem>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is PageWithEmbedded<TItem> =>
        isPage(x, faultCollector) &&
        isPageEmbedded(isItem)((x as PageWithEmbedded<TItem>)._embedded, faultCollector?.sub("_embedded"))
export default isPageWithEmbedded
