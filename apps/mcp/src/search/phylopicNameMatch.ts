export type NodeListItem = Readonly<{
    uuid?: string
    title?: string
    href?: string
}>

export const normalizeTaxonLabel = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ")

export const nodeTitle = (item: { _links?: { self?: { title?: string } }; title?: string }) =>
    item.title ?? item._links?.self?.title

export const isExactNodeTitleMatch = (title: string | undefined, query: string) =>
    title !== undefined && normalizeTaxonLabel(title) === normalizeTaxonLabel(query)

/** Prefer a node whose title exactly matches query (case-insensitive); else first list item. */
export const pickNodeFromNameSearch = (
    items: readonly NodeListItem[],
    query: string,
): Readonly<{ item: NodeListItem; match: "exact" | "fallback" }> | null => {
    if (!items.length) {
        return null
    }
    const exact = items.find(item => isExactNodeTitleMatch(item.title, query))
    if (exact?.uuid) {
        return { item: exact, match: "exact" }
    }
    const first = items[0]
    return first?.uuid ? { item: first, match: "fallback" } : null
}

export const sortNodesByTitleMatch = (items: readonly NodeListItem[], query: string): NodeListItem[] => {
    const exact = items.filter(item => isExactNodeTitleMatch(item.title, query))
    const rest = items.filter(item => !isExactNodeTitleMatch(item.title, query))
    return [...exact, ...rest]
}

export const findExactPhylopicNodeMatch = (
    groups: readonly { name: string; items: readonly NodeListItem[] }[],
    query: string,
): NodeListItem | null => {
    for (const group of groups) {
        const hit = group.items.find(item => isExactNodeTitleMatch(item.title, query))
        if (hit?.uuid) {
            return hit
        }
    }
    return null
}
