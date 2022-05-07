import { FaultDetector, isArray, isObject, isUndefinedOr, ValidationFaultCollector } from "@phylopic/utils"
import { PageEmbedded, PageWithEmbedded } from "../types/PageWithEmbedded"
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
