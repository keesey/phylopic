import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { nodeTitle } from "../search/phylopicNameMatch.js"

export type LineageEntry = Readonly<{
    uuid: string
    title?: string
}>

type LineageList = Readonly<{
    _embedded?: { items?: readonly { uuid?: string; _links?: { self?: { title?: string } }; title?: string }[] }
    _links?: { next?: { href?: string } | null }
}>

/** Tip-to-root UUID order (node first, then ancestors). Follows lineage pagination. */
export const fetchLineageEntries = async (
    client: PhyloPicClient,
    nodeUuid: string,
): Promise<readonly LineageEntry[]> => {
    const entries: LineageEntry[] = []
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
                entries.push({ uuid: item.uuid, title: nodeTitle(item) })
            }
        }
        page += 1
        if (!list._links?.next) {
            break
        }
    }
    return entries
}

export const fetchLineageUuids = async (client: PhyloPicClient, nodeUuid: string): Promise<readonly string[]> =>
    (await fetchLineageEntries(client, nodeUuid)).map(entry => entry.uuid)
