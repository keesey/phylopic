import { nodeTitle } from "./nodeTitle.js"

type LineageItem = Readonly<{
    uuid?: string
    title?: string
    names?: readonly unknown[]
    _links?: { self?: { title?: string } }
}>

type LineageList = Readonly<{
    _embedded?: { items?: readonly LineageItem[] }
    _links?: {
        items?: readonly { href?: string; title?: string }[]
        next?: { href?: string } | null
    }
}>

export type LineageEntry = Readonly<{
    uuid: string
    title?: string
}>

export type LineageFetcher = (
    nodeUuid: string,
    page: number,
) => Promise<LineageList>

const uuidFromNodeHref = (href: string): string | undefined => {
    const match = href.match(/\/nodes\/([^/?#]+)/i)
    return match?.[1]
}

const titlesFromPageItemLinks = (list: LineageList): ReadonlyMap<string, string> => {
    const titles = new Map<string, string>()
    for (const link of list._links?.items ?? []) {
        const href = link.href
        const title = link.title?.trim()
        if (!href || !title) {
            continue
        }
        const uuid = uuidFromNodeHref(href)
        if (uuid) {
            titles.set(uuid, title)
        }
    }
    return titles
}

const lineageItemTitle = (item: LineageItem, linkTitles: ReadonlyMap<string, string>): string | undefined => {
    if (!item.uuid) {
        return undefined
    }
    return nodeTitle(item as Parameters<typeof nodeTitle>[0]) ?? linkTitles.get(item.uuid)
}

/** Tip-to-root UUID order (node first, then ancestors). Follows lineage pagination. */
export const fetchLineageEntries = async (
    fetchPage: LineageFetcher,
    nodeUuid: string,
): Promise<readonly LineageEntry[]> => {
    const entries: LineageEntry[] = []
    let page = 0
    while (page < 64) {
        const list = await fetchPage(nodeUuid, page)
        const items = list._embedded?.items ?? []
        if (!items.length) {
            break
        }
        const linkTitles = titlesFromPageItemLinks(list)
        for (const item of items) {
            if (item.uuid) {
                const title = lineageItemTitle(item, linkTitles)
                entries.push({ uuid: item.uuid, title: title?.trim() || undefined })
            }
        }
        page += 1
        if (!list._links?.next) {
            break
        }
    }
    return entries
}

/** Tip-to-root UUID order (node first, then ancestors). */
export const fetchLineageUuids = async (
    fetchPage: LineageFetcher,
    nodeUuid: string,
): Promise<readonly string[]> => (await fetchLineageEntries(fetchPage, nodeUuid)).map(entry => entry.uuid)
