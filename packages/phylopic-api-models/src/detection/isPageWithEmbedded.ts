import { PageEmbedded, PageWithEmbedded } from "~/types/PageWithEmbedded"
import isPage from "./isPage"
const isPageEmbedded = <TItem>(x: unknown, isItem: (x: unknown) => x is TItem): x is PageEmbedded<TItem> =>
    typeof x === "object" &&
    x !== null &&
    Array.isArray((x as PageEmbedded<TItem>).items) &&
    (x as PageEmbedded<TItem>).items.every(isItem)
export const isPageWithEmbedded = <TItem>(
    x: unknown,
    isItem: (x: unknown) => x is TItem,
): x is PageWithEmbedded<TItem> => isPage(x) && isPageEmbedded((x as PageWithEmbedded<TItem>)._embedded, isItem)
export default isPageWithEmbedded
