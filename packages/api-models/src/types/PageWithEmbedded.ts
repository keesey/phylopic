import { Page, PageLinks } from "./Page.js"
import { WithEmbedded } from "./WithEmbedded.js"
export interface PageEmbedded<TItem> {
    readonly items: readonly TItem[]
}
export type PageWithEmbedded<TItem> = WithEmbedded<Page, PageLinks, "items", PageEmbedded<TItem>>
