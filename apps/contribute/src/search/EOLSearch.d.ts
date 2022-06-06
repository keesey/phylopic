export interface EOLSearch {
    readonly itemsPerPage: number
    readonly results: readonly EOLSearchResult[]
    readonly startIndex: number
    readonly totalResults: number
}
export interface EOLSearchResult {
    readonly content: string
    readonly id: number
    readonly link: URL
    readonly title: string
}
