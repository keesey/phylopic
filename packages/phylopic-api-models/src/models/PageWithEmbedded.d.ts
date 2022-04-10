import { Page } from "./Page"
export interface PageEmbedded<TItem> {
    readonly items: readonly TItem[]
}
export interface PageWithEmbedded<TItem> extends Page {
    readonly _embedded: Partial<PageEmbedded<TItem>>
}
