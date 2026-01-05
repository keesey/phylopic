import { iterateList, type SourceClient } from "@phylopic/source-client"
import type { Node } from "@phylopic/source-models"
import {
    type Authority,
    getIdentifier,
    isScientific,
    type Namespace,
    type Nomen,
    type ObjectID,
    stringifyNomen,
    type UUID,
} from "@phylopic/utils"
import axios, { InternalAxiosRequestConfig } from "axios"
import Bottleneck from "bottleneck"
type Identifier = Readonly<{ authority: Authority; namespace: Namespace; objectID: ObjectID }>
const limiter = new Bottleneck({
    maxConcurrent: 10,
    minTime: 100,
})
const AxiosInstance = axios.create({
    headers: {
        "api-key": process.env.NCBI_API_KEY,
    },
})
const IGNORED = new Set(["1", "131567"])
type NCBITaxonomyNodes = Readonly<{
    taxonomy_nodes: readonly NCBITaxonomyNode[]
}>
type NCBITaxonomyNode = Readonly<{
    query: readonly string[]
    taxonomy: NCBITaxonomy
}>
type NCBITaxonomy = Readonly<{
    lineage: readonly number[]
    organism_name: string
    tax_id: number
}>
type NCBITaxonLinks = Readonly<{
    encyclopedia_of_life?: string
    global_biodiversity_information_facility?: string
    tax_id: string
}>
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
const getTaxonomies = async (
    queries: ReadonlyArray<string | number>,
    chunkSize = 20,
): Promise<readonly NCBITaxonomy[]> => {
    queries = Array.from(new Set(queries.filter(Boolean))).sort()
    if (queries.length === 0) {
        return []
    }
    const taxonomies: NCBITaxonomy[] = []
    do {
        const response = await limiter.schedule(() =>
            AxiosInstance.get<NCBITaxonomyNodes>(
                `https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/${encodeURIComponent(
                    queries.slice(0, chunkSize).join(","),
                )}`,
            ).catch(e => {
                console.warn(e)
                return null
            }),
        )
        if (response) {
            taxonomies.push(...response.data.taxonomy_nodes.map(node => node.taxonomy).filter(Boolean))
        }
        queries = queries.slice(chunkSize)
    } while (queries.length > 0)
    return Array.from(
        Object.values(
            taxonomies.reduce<Record<string, NCBITaxonomy>>((acc, value) => ({ ...acc, [value.tax_id]: value }), {}),
        ),
    ).sort((a, b) => a.tax_id - b.tax_id)
}
const getLineageMatchIndex = (ancestorIds: readonly string[], lineage: NCBITaxonomy["lineage"]) => {
    return lineage.filter(lineageId => ancestorIds.includes(String(lineageId))).length
}
const findMatches = async (
    ancestorIds: readonly string[],
    candidates: readonly NCBITaxonomy[],
    canonicalName: string,
): Promise<readonly NCBITaxonomy[]> => {
    if (!candidates.length) {
        return []
    }
    if (candidates.length === 1) {
        const candidate = candidates[0]
        if (ancestorIds.length) {
            if (!candidate.lineage.some(id => ancestorIds.includes(String(id)))) {
                console.warn(
                    `Found a match for ${canonicalName}, but not under the right ancestor:`,
                    candidate.tax_id,
                    `(${candidate.organism_name})`,
                )
                return []
            }
        }
        return [candidate]
    }
    if (!ancestorIds.length) {
        return candidates.filter(candidate => candidate.organism_name.toLowerCase() === canonicalName.toLowerCase())
    }
    {
        const matchIndices = candidates.map(candidate => getLineageMatchIndex(ancestorIds, candidate.lineage))
        const highestMatchIndex = Math.max(...matchIndices)
        if (highestMatchIndex === 0) {
            console.warn(
                `Found matches for ${canonicalName}, but not under the same taxon:`,
                candidates.map(candidate => `${candidate.tax_id} (${candidate.organism_name})`).join("; "),
            )
            return []
        }
        const bestMatches = candidates.filter((_, index) => matchIndices[index] >= highestMatchIndex)
        if (bestMatches.length > 1) {
            const nameMatches = bestMatches.filter(
                candidate => candidate.organism_name.toLowerCase() === canonicalName.toLowerCase(),
            )
            if (nameMatches.length > 0) {
                return nameMatches
            }
        }
        return bestMatches
    }
}
const getIdentifiers = (links: NCBITaxonLinks): readonly Identifier[] => {
    const results: Identifier[] = []
    if (links.encyclopedia_of_life) {
        const url = new URL(links.encyclopedia_of_life)
        const match = url.pathname.match(/^\/pages\/([^/]+)$/)
        if (/\.?eol\.org$/.test(url.hostname) && match?.[1]) {
            results.push({ authority: "eol.org", namespace: "pages", objectID: match[1] })
        }
    }
    if (links.global_biodiversity_information_facility) {
        const url = new URL(links.global_biodiversity_information_facility)
        const match = url.pathname.match(/^\/species\/([^/]+)$/)
        if (/\.?gbif\.org$/.test(url.hostname) && match?.[1]) {
            results.push({ authority: "gbif.org", namespace: "species", objectID: match[1] })
        }
    }
    return results
}
const processNode = async (client: SourceClient, node: Node & { uuid: UUID }, ancestorIds: readonly string[]) => {
    const page = await client.node(node.uuid).externals.namespace("ncbi.nlm.nih.gov", "taxid").page()
    if (page.items.length) {
        if (!IGNORED.has(page.items[0].objectID)) {
            ancestorIds = [...ancestorIds, page.items[0].objectID]
        }
    } else {
        const names = getScientificNames(node.names)
        const taxonomies = await getTaxonomies(names)
        const matches = await findMatches(ancestorIds, taxonomies, names[0])
        for (const match of matches) {
            const externalClient = client.external("ncbi.nlm.nih.gov", "taxid", match.tax_id.toString())
            if (await externalClient.exists()) {
                console.info(
                    `${getIdentifier(
                        "ncbi.nlm.nih.gov",
                        "taxid",
                        match.tax_id.toString(),
                    )} is already assigned to another node.`,
                )
            } else {
                if (!IGNORED.has(match.tax_id.toString())) {
                    ancestorIds = [...ancestorIds, match.tax_id.toString()]
                }
                console.info(
                    `${getIdentifier("ncbi.nlm.nih.gov", "taxid", match.tax_id.toString())} (${
                        match.organism_name
                    }) => phylopic.org/nodes/${node.uuid} (${stringifyNomen(node.names[0])})`,
                )
                await externalClient.put({
                    authority: "ncbi.nlm.nih.gov",
                    namespace: "taxid",
                    node: node.uuid,
                    objectID: match.tax_id.toString(),
                    title: match.organism_name,
                })
                const response = await limiter.schedule(() =>
                    AxiosInstance.get<NCBITaxonLinks>(
                        `https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/${encodeURIComponent(
                            match.tax_id,
                        )}/links`,
                    ).catch(e => {
                        console.warn(e)
                        return null
                    }),
                )
                if (response) {
                    for (const { authority, namespace, objectID } of getIdentifiers(response.data)) {
                        const externalClient = client.external(authority, namespace, objectID)
                        if (!(await externalClient.exists())) {
                            console.info(
                                `${getIdentifier(authority, namespace, objectID)} (${
                                    match.organism_name
                                }) => phylopic.org/nodes/${node.uuid} (${stringifyNomen(node.names[0])})`,
                            )
                            await externalClient.put({
                                authority,
                                namespace,
                                node: node.uuid,
                                objectID,
                                title: match.organism_name,
                            })
                        }
                    }
                }
            }
        }
    }
    const childPromises: Array<Promise<void>> = []
    for await (const child of iterateList(client.node(node.uuid).children)) {
        childPromises.push(processNode(client, child, ancestorIds))
    }
    await Promise.all(childPromises)
}
const autolinkNCBI = async (client: SourceClient): Promise<void> => {
    const node = await client.root.get()
    await processNode(client, node, [])
}
export default autolinkNCBI
