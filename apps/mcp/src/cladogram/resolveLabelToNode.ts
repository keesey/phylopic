import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import {
    nodeTitle,
    normalizeTaxonLabel,
    pickNodeFromNameSearch,
    type NodeListItem,
} from "../search/phylopicNameMatch.js"

export type ResolveLabelResult = Readonly<{
    nodeUuid: string
    title?: string
    warnings: readonly string[]
}>

type NodeListResponse = Readonly<{
    _embedded?: { items?: readonly { uuid?: string; _links?: { self?: { title?: string } } }[] }
}>

const toItems = (list: NodeListResponse): NodeListItem[] =>
    (list._embedded?.items ?? []).map(item => ({
        uuid: item.uuid,
        title: nodeTitle(item),
    }))

const listByFilterName = async (client: PhyloPicClient, name: string): Promise<NodeListItem[] | null> => {
    try {
        const list = await client.getJson<NodeListResponse>("/nodes", {
            filter_name: name,
            embed_items: "true",
            page: 0,
        })
        return toItems(list)
    } catch {
        return null
    }
}

/** Case-sensitive dedupe — PhyloPic filter_name is case-sensitive (e.g. homo sapiens vs Homo sapiens). */
const uniqueFilterNames = (names: readonly string[]) => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const name of names) {
        const trimmed = name.trim()
        if (!trimmed || seen.has(trimmed)) {
            continue
        }
        seen.add(trimmed)
        out.push(trimmed)
    }
    return out
}

export const resolveLabelToNode = async (client: PhyloPicClient, label: string): Promise<ResolveLabelResult> => {
    const warnings: string[] = []
    const query = label.trim()
    const { matches } = await client.getJson<{ matches: readonly string[] }>("/autocomplete", { query })
    const exactAutocomplete = matches.find(name => normalizeTaxonLabel(name) === normalizeTaxonLabel(query))
    const candidateNames = uniqueFilterNames([
        query.toLowerCase(),
        query,
        ...(exactAutocomplete ? [exactAutocomplete] : []),
        ...matches,
        ...(matches.length ? [] : [query]),
    ])

    for (const name of candidateNames.slice(0, 12)) {
        const items = await listByFilterName(client, name)
        if (!items?.length) {
            continue
        }
        const picked = pickNodeFromNameSearch(items, query)
        if (picked?.match === "exact") {
            if (normalizeTaxonLabel(name) !== normalizeTaxonLabel(query)) {
                warnings.push(`Resolved label "${query}" via PhyloPic filter_name "${name}" (exact title match).`)
            }
            return {
                nodeUuid: picked.item.uuid!,
                title: picked.item.title,
                warnings,
            }
        }
    }

    for (const name of candidateNames.slice(0, 12)) {
        const items = await listByFilterName(client, name)
        if (!items?.length) {
            continue
        }
        const picked = pickNodeFromNameSearch(items, query)
        if (picked?.match === "fallback") {
            warnings.push(
                `No exact PhyloPic title match for "${query}"; using "${picked.item.title ?? name}" from filter_name "${name}". Prefer search_nodes exactMatch or pass node_uuid when precision matters.`,
            )
            return {
                nodeUuid: picked.item.uuid!,
                title: picked.item.title,
                warnings,
            }
        }
    }

    throw new Error(`No PhyloPic node found for label "${query}".`)
}
