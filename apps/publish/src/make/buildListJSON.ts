import { List, Page, PageWithEmbedded, TitledLink } from "@phylopic/api-models"
import { createSearch, stringifyNormalized, UUID } from "@phylopic/utils"

export type ListItem = Readonly<{
    json: string
    title: string | null
    uuid: UUID
}>

export const buildListIndexJSON = (
    build: number,
    listPath: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    totalItems: number,
    itemsPerPage: number,
): string =>
    stringifyNormalized({
        _links: {
            firstPage:
                totalItems > 0
                    ? { href: listPath + createSearch({ ...listQuery, page: 0 }) }
                    : null,
            lastPage:
                totalItems > 0
                    ? {
                          href:
                              listPath +
                              createSearch({ ...listQuery, page: Math.ceil(totalItems / itemsPerPage) - 1 }),
                      }
                    : null,
            self: { href: listPath + createSearch(listQuery) },
        },
        build,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
    } satisfies List)

export const buildListPageLinksJSON = (
    build: number,
    listPath: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    pageIndex: number,
    lastPage: boolean,
    items: readonly ListItem[],
    linkHref: (uuid: UUID) => string,
    defaultTitle: string,
): string => {
    const itemLinks: TitledLink[] = items.map(({ title, uuid }) => ({
        href: linkHref(uuid),
        title: title || defaultTitle,
    }))
    const { page: _page, ...listQueryWithoutPage } = listQuery
    return stringifyNormalized({
        _links: {
            items: itemLinks,
            list: { href: listPath + createSearch(listQueryWithoutPage) },
            next: lastPage ? null : { href: listPath + createSearch({ ...listQuery, page: pageIndex + 1 }) },
            previous:
                pageIndex > 0 ? { href: listPath + createSearch({ ...listQuery, page: pageIndex - 1 }) } : null,
            self: { href: listPath + createSearch({ ...listQuery, page: pageIndex }) },
        },
        build,
        index: pageIndex,
    } satisfies Page)
}

export const buildListPageItemsJSON = (
    build: number,
    listPath: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    pageIndex: number,
    lastPage: boolean,
    items: readonly ListItem[],
    linkHref: (uuid: UUID) => string,
    defaultTitle: string,
): string => {
    const itemLinks: TitledLink[] = items.map(({ title, uuid }) => ({
        href: linkHref(uuid),
        title: title || defaultTitle,
    }))
    const itemsJSON = items.map(({ json }) => json)
    const o: PageWithEmbedded<unknown> = {
        _embedded: {},
        ...JSON.parse(
            buildListPageLinksJSON(build, listPath, listQuery, pageIndex, lastPage, items, linkHref, defaultTitle),
        ),
    }
    const json = stringifyNormalized(o)
    return json.replace('"_embedded":{}', `"_embedded":{"items":[${itemsJSON.join(",")}]}`)
}

export const paginateListItems = <T>(items: readonly T[], itemsPerPage: number): readonly (readonly T[])[] => {
    const pages: T[][] = []
    for (let offset = 0; offset < items.length; offset += itemsPerPage) {
        pages.push(items.slice(offset, offset + itemsPerPage) as T[])
    }
    return pages
}
