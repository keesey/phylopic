import { nodeTitle } from "./nodeTitle.js"

type LineageItem = Readonly<{
    uuid?: string
    title?: string
    _links?: { self?: { title?: string } }
}>

type LineageList = Readonly<{
    _embedded?: { items?: readonly LineageItem[] }
    _links?: { next?: { href?: string } | null }
}>

export type LineageEntry = Readonly<{
    uuid: string
    title?: string
}>

export type LineageFetcher = (
    nodeUuid: string,
    page: number,
) => Promise<LineageList>

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
        for (const item of items) {
            if (item.uuid) {
                entries.push({ uuid: item.uuid, title: nodeTitle(item)?.trim() || undefined })
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
