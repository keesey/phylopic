type LineageList = Readonly<{
    _embedded?: { items?: readonly { uuid?: string }[] }
    _links?: { next?: { href?: string } | null }
}>

export type LineageFetcher = (
    nodeUuid: string,
    page: number,
) => Promise<LineageList>

/** Tip-to-root UUID order (node first, then ancestors). */
export const fetchLineageUuids = async (
    fetchPage: LineageFetcher,
    nodeUuid: string,
): Promise<readonly string[]> => {
    const uuids: string[] = []
    let page = 0
    while (page < 64) {
        const list = await fetchPage(nodeUuid, page)
        const items = list._embedded?.items ?? []
        if (!items.length) {
            break
        }
        for (const item of items) {
            if (item.uuid) {
                uuids.push(item.uuid)
            }
        }
        page += 1
        if (!list._links?.next) {
            break
        }
    }
    return uuids
}
