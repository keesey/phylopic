import { gbifResolveObjectIDs, suggestGbifSpecies } from "./gbif.js"
import { otolResolveObjectIDs, suggestOtolTaxa } from "./otol.js"
import { pbdbResolveObjectIDs, suggestPbdbTaxa } from "./pbdb.js"

export type ExternalAuthority = "gbif.org" | "opentreeoflife.org" | "paleobiodb.org"

export type ExternalNamespace = "species" | "taxonomy" | "txn"

export type ExternalTaxonMatch = Readonly<{
    authority: ExternalAuthority
    namespace: ExternalNamespace
    objectID: string
    title: string
}>

export type ResolvedExternalTaxon = ExternalTaxonMatch &
    Readonly<{
        objectIDs: readonly string[]
        phylopic: Readonly<{
            uuid?: string
            title?: string
            href?: string
        }> | null
    }>

export type ResolveToPhylopic = (
    authority: ExternalAuthority,
    namespace: ExternalNamespace,
    objectIDs: readonly string[],
) => Promise<
    Readonly<{
        uuid?: string
        title?: string
        href?: string
    }> | null
>

export type SearchExternalOptions = Readonly<{
    limitPerSource?: number
    resolve?: ResolveToPhylopic
    sources?: readonly ExternalAuthority[]
}>

const DEFAULT_SOURCES: readonly ExternalAuthority[] = ["gbif.org", "opentreeoflife.org", "paleobiodb.org"]

const objectIDsForMatch = async (match: ExternalTaxonMatch): Promise<readonly string[]> => {
    switch (match.authority) {
        case "gbif.org": {
            const key = parseInt(match.objectID, 10)
            return Number.isFinite(key) ? gbifResolveObjectIDs(key) : [match.objectID]
        }
        case "opentreeoflife.org": {
            const ott_id = parseInt(match.objectID, 10)
            return Number.isFinite(ott_id) ? otolResolveObjectIDs(ott_id) : [match.objectID]
        }
        case "paleobiodb.org":
            return pbdbResolveObjectIDs(match.objectID)
        default:
            return [match.objectID]
    }
}

export const suggestExternalTaxa = async (
    query: string,
    options: Pick<SearchExternalOptions, "limitPerSource" | "sources"> = {},
): Promise<readonly ExternalTaxonMatch[]> => {
    const limit = options.limitPerSource ?? 8
    const sources = new Set(options.sources ?? DEFAULT_SOURCES)
    const tasks: Array<Promise<readonly ExternalTaxonMatch[]>> = []

    if (sources.has("gbif.org")) {
        tasks.push(
            suggestGbifSpecies(query, limit).then(items =>
                items.map(({ key, title }) => ({
                    authority: "gbif.org" as const,
                    namespace: "species" as const,
                    objectID: String(key),
                    title,
                })),
            ),
        )
    }
    if (sources.has("opentreeoflife.org")) {
        tasks.push(
            suggestOtolTaxa(query).then(items =>
                items.slice(0, limit).map(({ ott_id, title }) => ({
                    authority: "opentreeoflife.org" as const,
                    namespace: "taxonomy" as const,
                    objectID: String(ott_id),
                    title,
                })),
            ),
        )
    }
    if (sources.has("paleobiodb.org")) {
        tasks.push(
            suggestPbdbTaxa(query, limit).then(items =>
                items.map(({ oid, title }) => ({
                    authority: "paleobiodb.org" as const,
                    namespace: "txn" as const,
                    objectID: oid,
                    title,
                })),
            ),
        )
    }

    const settled = await Promise.allSettled(tasks)
    const matches: ExternalTaxonMatch[] = []
    for (const result of settled) {
        if (result.status === "fulfilled") {
            matches.push(...result.value)
        }
    }
    return matches
}

export const searchExternalTaxa = async (
    query: string,
    options: SearchExternalOptions = {},
): Promise<readonly ResolvedExternalTaxon[]> => {
    const matches = await suggestExternalTaxa(query, options)
    if (!options.resolve) {
        return matches.map(match => ({ ...match, objectIDs: [], phylopic: null }))
    }

    return Promise.all(
        matches.map(async match => {
            const objectIDs = await objectIDsForMatch(match)
            const phylopic = await options.resolve!(match.authority, match.namespace, objectIDs)
            return { ...match, objectIDs, phylopic }
        }),
    )
}
