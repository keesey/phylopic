import { iterateList, SourceClient } from "@phylopic/source-client"
import { External, Node } from "@phylopic/source-models"
import {
    Authority,
    createSearch,
    getIdentifier,
    getIdentifierParts,
    isScientific,
    Namespace,
    Nomen,
    normalizeText,
    ObjectID,
    shortenNomen,
    stringifyNomen,
    UUID,
} from "@phylopic/utils"
import axios from "axios"
interface EOLSearchResult {
    readonly content: string
    readonly id: number
    readonly link: string
    readonly title: string
}
interface EOLSearchResults {
    readonly itemsPerPage: number
    readonly results: readonly EOLSearchResult[]
    readonly startIndex: number
    readonly totalResults: number
}
interface SPARQLResponse {
    readonly head: {
        readonly vars: readonly string[]
    }
    readonly results: {
        readonly bindings: ReadonlyArray<
            Readonly<
                Record<
                    string,
                    {
                        readonly type: "literal" | "uri"
                        readonly value: string
                        readonly "xml:lang"?: string
                    }
                >
            >
        >
    }
}
const getPathsFromNamebank = async (namebankIDs?: ReadonlySet<number>): Promise<readonly string[]> => {
    if (!namebankIDs || !namebankIDs.size) {
        return []
    }
    const namebankIDList = [...namebankIDs]
        .sort()
        .map(id => `'${Number(id)}'`)
        .join(",")
    const sparqlQuery = `SELECT ?item ?uBIO_ID ?EOL_ID WHERE {?item wdt:P4728 ?uBIO_ID. OPTIONAL {?item wdt:P830 ?EOL_ID.} FILTER(?uBIO_ID IN (${namebankIDList}))}`
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`
    const headers = {
        Accept: "application/sparql-results+json",
        "User-Agent": "phylopic/2.0 (https://www.phylopic.org/; keesey+phylopic@gmail.com) phylopic-publish/1.0.0",
    }
    // console.debug(`Looking for EoL matches for uBio NameBank IDs: ${[...namebankIDs].sort().join(", ")}...`)
    const response = await axios.get<SPARQLResponse>(url, { headers, responseType: "json" })
    const eolIDs = new Set<string>()
    if (response.data?.results?.bindings) {
        response.data.results.bindings.forEach(binding => {
            if (binding.EOL_ID) {
                eolIDs.add(binding.EOL_ID.value)
            }
        })
    }
    const result = [...eolIDs].sort().map(id => `eol.org/pages/${encodeURIComponent(id)}`)
    // console.debug(`Found ${result.length} link${result.length === 1 ? "" : "s"}.`)
    return result
}
const hasNamebankLink = async (client: SourceClient, nodeUUID: UUID): Promise<boolean> => {
    return (await client.node(nodeUUID).externals.namespace("ubio.org", "namebank").totalItems()) > 0
}
const getNamebankIDs = async (client: SourceClient, nodeUUID: UUID): Promise<readonly number[]> => {
    const externals = iterateList(client.node(nodeUUID).externals.namespace("ubio.org", "namebank"))
    const ids: number[] = []
    for await (const external of externals) {
        ids.push(parseInt(external.objectID, 10))
    }
    return ids.sort()
}
const getParentEOLPageIDs = async (client: SourceClient, node: Node): Promise<readonly number[]> => {
    const parentUUID = node.parent
    if (!parentUUID) {
        return []
    }
    const ids = await getNamebankIDs(client, parentUUID)
    if (ids.length > 0) {
        return ids
    }
    const parentNode = await client.node(parentUUID).get()
    return getParentEOLPageIDs(client, parentNode)
}
const getFirstEOLSearchMatch = async (names: readonly Nomen[], parentEOLPageID?: number) => {
    const scientificNames = names.filter(isScientific)
    for (const name of scientificNames) {
        const query = {
            exact: true,
            filter_by_taxon_concept_id: parentEOLPageID,
            key: process.env.EOL_API_KEY,
            q: stringifyNomen(shortenNomen(name)),
        }
        const response = await axios.get<EOLSearchResults>(
            `https://eol.org/api/search/1.0.json${createSearch(query)}`,
            { responseType: "json" },
        )
        const results = response.data.results.filter(result => result.title === query.q)
        if (results.length > 0) {
            return results
        }
    }
    return []
}
const processEOLEntry = async (client: SourceClient, node: Node & { uuid: UUID }) => {
    const parentID = (await getParentEOLPageIDs(client, node))[0]
    const matches = await getFirstEOLSearchMatch(node.names, parentID)
    if (matches?.length === 1) {
        const { id } = matches[0]
        const title = normalizeText(matches[0].title)
        const externalClient = client.external("eol.org", "pages", String(id))
        const exists = await externalClient.exists()
        const existingNodeUUID = exists ? (await externalClient.get()).node : null
        if (existingNodeUUID && existingNodeUUID !== node.uuid) {
            console.warn(`Match found for EOL ID ${id} (${title}), but it is already assigned to another node.`)
        } else {
            console.info(
                `eol.org/pages/${encodeURIComponent(id)} (${title}) => phylopic.org/nodes/${
                    node.uuid
                } (${stringifyNomen(node.names[0])})`,
            )
            await externalClient.put({
                authority: "eol.org",
                namespace: "pages",
                node: node.uuid,
                objectID: String(id),
                title,
            })
        }
    }
}
const processEOL = async (client: SourceClient, nodes: ReadonlyArray<Node & { uuid: UUID }>) => {
    console.info(`Processing ${nodes.length} EoL candidates.`)
    for (const node of nodes) {
        try {
            await processEOLEntry(client, node)
        } catch (e) {
            console.warn(`Error looking up ${stringifyNomen(node.names[0])} <${node.uuid}>:`, e)
        }
    }
}
const processNamebank = async (client: SourceClient, nodes: ReadonlyArray<Node & { uuid: UUID }>) => {
    console.info(`Processing ${nodes.length} Namebank candidates.`)
    for (const node of nodes) {
        try {
            const paths = await getPathsFromNamebank(new Set(await getNamebankIDs(client, node.uuid)))
            if (paths.length === 0) {
                await processEOLEntry(client, node)
            } else {
                const title = stringifyNomen(node.names[0])
                for (const path of paths) {
                    const [authority, namespace, objectID] = getIdentifierParts(path)
                    const externalClient = client.external(authority, namespace, objectID)
                    const exists = await externalClient.exists()
                    const existingNodeUUID = exists ? (await externalClient.get()).node : null
                    if (existingNodeUUID && existingNodeUUID !== node.uuid) {
                        console.warn(
                            `Match found for EOL ID ${objectID} (${title}), but it is already assigned to another node.`,
                        )
                    } else {
                        console.info(
                            `${getIdentifier(authority, namespace, objectID)} (${title}) => phylopic.org/nodes/${
                                node.uuid
                            } (${stringifyNomen(node.names[0])})`,
                        )
                        await externalClient.put({
                            authority,
                            namespace,
                            node: node.uuid,
                            objectID,
                            title,
                        })
                    }
                }
            }
        } catch (e) {
            console.warn(`Error looking up ${stringifyNomen(node.names[0])} <${node.uuid}>:`, e)
        }
    }
}
const getCandidates = async (client: SourceClient) => {
    const alreadyLinked: UUID[] = []
    for await (const external of iterateList(client.externals("eol.org", "pages"))) {
        alreadyLinked.push(external.node)
    }
    console.info(`${alreadyLinked.length} nodes have already been linked.`)
    const candidates: Array<Node & { uuid: UUID }> = []
    for await (const node of iterateList(client.nodes)) {
        if (!alreadyLinked.includes(node.uuid) && node.names.some(isScientific)) {
            candidates.push(node)
        }
    }
    return candidates
}
const getNamebankExterals = async (client: SourceClient) => {
    const results: Array<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> = []
    for await (const external of iterateList(client.externals("ubio.org", "namebank"))) {
        results.push(external)
    }
    return results
}
const autolinkEOL = async (client: SourceClient): Promise<void> => {
    const [candidates, namebankExternals] = await Promise.all([getCandidates(client), getNamebankExterals(client)])
    console.info(`Processing ${candidates.length} node${candidates.length === 1 ? "" : "s"}...`)
    const [namebankCandidates, otherCandidates] = candidates.reduce<
        [Array<Node & { uuid: UUID }>, Array<Node & { uuid: UUID }>]
    >(
        (prev, candidate) => {
            if (namebankExternals.some(external => external.node === candidate.uuid)) {
                return [[...prev[0], candidate], prev[1]]
            }
            return [prev[0], [...prev[1], candidate]]
        },
        [[], []],
    )
    await Promise.all([processNamebank(client, namebankCandidates), processEOL(client, otherCandidates)])
    console.info(`Processed ${candidates.length} node${candidates.length === 1 ? "" : "s"}.`)
}
export default autolinkEOL
