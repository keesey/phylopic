import { Page } from "./Page"
export interface Listable<TValue, TPageSpecifier> {
    page(pageSpecifier?: TPageSpecifier): Promise<Page<TValue, TPageSpecifier>>
    totalItems(): Promise<number>
    totalPages(): Promise<number>
}
