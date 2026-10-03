import type { PhyloPicClient } from "../client/PhyloPicClient.js"

type LineageList = Readonly<{
    _embedded?: { items?: readonly { uuid?: string }[] }
}>

/** Tip-to-root UUID order (node first, then ancestors). Follows lineage pagination. */
export const fetchLineageUuids = async (client: PhyloPicClient, nodeUuid: string): Promise<readonly string[]> => {
    const uuids: string[] = []
    let page = 0
    while (page < 64) {
        const list = await client.getJson<LineageList>(`/nodes/${nodeUuid}/lineage`, {
            embed_items: "true",
            page,
        })
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
        if (items.length < 48) {
            break
        }
    }
    return uuids
}
