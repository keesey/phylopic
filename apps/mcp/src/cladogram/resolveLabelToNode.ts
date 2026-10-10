import type { FetchFn, PhyloPicClient } from "../client/PhyloPicClient.js"
import { expandFromContext, expandFromGbif, parseAbbreviatedName, type AbbreviatedName } from "./abbreviatedGenus.js"
import { derivedGroupNames, expandFromGbifVernacular, isPossibleCommonName } from "./vernacularLabel.js"
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

type NamePart = Readonly<{ class?: string; text?: string }>

type NodeListResponse = Readonly<{
    _embedded?: {
        items?: readonly {
            uuid?: string
            names?: readonly (readonly NamePart[])[]
            _links?: { self?: { title?: string } }
        }[]
    }
}>

type NodeListItemWithNames = NodeListItem & Readonly<{ scientificNames: readonly string[] }>

/** Scientific parts only, so `Bovinae` matches the name stored as `Bovinae` + citation `Gray 1821`. */
const scientificNameText = (name: readonly NamePart[]) =>
    name
        .filter(part => part.class === "scientific")
        .map(part => part.text ?? "")
        .join(" ")
        .trim()

const toItems = (list: NodeListResponse): NodeListItemWithNames[] =>
    (list._embedded?.items ?? []).map(item => ({
        uuid: item.uuid,
        title: nodeTitle(item),
        scientificNames: (item.names ?? []).map(scientificNameText).filter(Boolean),
    }))

const listByFilterName = async (client: PhyloPicClient, name: string): Promise<NodeListItemWithNames[] | null> => {
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

export type ResolveLabelOptions = Readonly<{
    /** Other labels in the same tree, used to expand abbreviated genera such as `P. paniscus`. */
    contextLabels?: readonly string[]
    fetch?: FetchFn
}>

const resolveAbbreviatedLabel = async (
    client: PhyloPicClient,
    query: string,
    name: AbbreviatedName,
    options: ResolveLabelOptions,
): Promise<ResolveLabelResult> => {
    for (const fullName of expandFromContext(name, options.contextLabels ?? [])) {
        const exact = await findExactNode(client, fullName)
        if (exact) {
            return { ...exact, warnings: [`Expanded "${query}" to "${fullName}" from other labels in the tree.`] }
        }
    }
    const hits: (ResolveLabelResult & { fullName: string })[] = []
    for (const fullName of await expandFromGbif(name, options.fetch)) {
        const exact = await findExactNode(client, fullName)
        if (exact) {
            hits.push({ ...exact, fullName })
        }
    }
    if (hits.length === 1) {
        const [hit] = hits
        return {
            nodeUuid: hit!.nodeUuid,
            title: hit!.title,
            warnings: [`Expanded "${query}" to "${hit!.fullName}" via GBIF.`],
        }
    }
    if (hits.length > 1) {
        throw new Error(
            `Abbreviated label "${query}" is ambiguous in PhyloPic: ${hits.map(hit => hit.fullName).join(", ")}. Use the full name.`,
        )
    }
    throw new Error(`No PhyloPic node found for abbreviated label "${query}". Use the full name.`)
}

/** How loosely a name search may match: the node title, any of its scientific names, or the first result. */
type NameMatch = "title" | "name" | "fallback"

const findExactNode = async (
    client: PhyloPicClient,
    query: string,
    match: Exclude<NameMatch, "fallback"> = "name",
): Promise<ResolveLabelResult | null> => {
    try {
        return await resolveByName(client, query, match)
    } catch {
        return null
    }
}

export const resolveLabelToNode = async (
    client: PhyloPicClient,
    label: string,
    options: ResolveLabelOptions = {},
): Promise<ResolveLabelResult> => {
    const query = label.trim()
    const exact = await findExactNode(client, query, "title")
    if (exact) {
        return exact
    }
    const abbreviated = parseAbbreviatedName(query)
    if (abbreviated) {
        return resolveAbbreviatedLabel(client, query, abbreviated, options)
    }
    if (isPossibleCommonName(query)) {
        const common = await resolveCommonName(client, query, options)
        if (common) {
            return common
        }
    }
    return resolveByName(client, query, "fallback")
}

/** `bovine` → Bovinae by stem first, then English common names from GBIF (`rodent` → Rodentia). */
const resolveCommonName = async (
    client: PhyloPicClient,
    query: string,
    options: ResolveLabelOptions,
): Promise<ResolveLabelResult | null> => {
    for (const name of derivedGroupNames(query)) {
        const exact = await findExactNode(client, name)
        if (exact) {
            return { ...exact, warnings: [`Read "${query}" as the group name "${name}".`, ...exact.warnings] }
        }
    }
    for (const name of await expandFromGbifVernacular(query, options.fetch)) {
        const exact = await findExactNode(client, name)
        if (exact) {
            return { ...exact, warnings: [`Resolved common name "${query}" to "${name}" via GBIF.`, ...exact.warnings] }
        }
    }
    return null
}

const resolveByName = async (client: PhyloPicClient, query: string, match: NameMatch): Promise<ResolveLabelResult> => {
    const warnings: string[] = []
    const { matches } = await client.getJson<{ matches: readonly string[] }>("/autocomplete", { query })
    const exactAutocomplete = matches.find(name => normalizeTaxonLabel(name) === normalizeTaxonLabel(query))
    const candidateNames = uniqueFilterNames([
        query.toLowerCase(),
        query,
        ...(exactAutocomplete ? [exactAutocomplete] : []),
        ...matches,
        ...(matches.length ? [] : [query]),
    ])

    const lists: { name: string; items: NodeListItemWithNames[] }[] = []
    for (const name of candidateNames.slice(0, 12)) {
        const items = await listByFilterName(client, name)
        if (!items?.length) {
            continue
        }
        lists.push({ name, items })
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

    for (const { items } of match === "title" ? [] : lists) {
        const synonym = items.find(item =>
            item.scientificNames.some(name => normalizeTaxonLabel(name) === normalizeTaxonLabel(query)),
        )
        if (synonym?.uuid) {
            return {
                nodeUuid: synonym.uuid,
                title: synonym.title,
                warnings: [`"${query}" is another name of PhyloPic node "${synonym.title ?? synonym.uuid}".`],
            }
        }
    }

    for (const { name, items } of match === "fallback" ? lists : []) {
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
