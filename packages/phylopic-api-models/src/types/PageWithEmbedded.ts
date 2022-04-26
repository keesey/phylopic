import { Page, PageLinks } from "./Page"
import { WithEmbedded } from "./WithEmbedded"
export interface PageEmbedded<TItem> {
    readonly items: readonly TItem[]
}
export type PageWithEmbedded<TItem> = WithEmbedded<Page, PageLinks, "items", PageEmbedded<TItem>>
