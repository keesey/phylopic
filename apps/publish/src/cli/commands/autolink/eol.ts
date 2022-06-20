import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "@phylopic/api-models"
import { Entity, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import {
    createSearch,
    isScientific,
    isUUID,
    Nomen,
    normalizeText,
    shortenNomen,
    stringifyNomen,
    stringifyNormalized,
    UUID,
} from "@phylopic/utils"
import axios from "axios"
import type { CLIData } from "../../getCLIData.js"
import { CommandResult, SourceUpdate } from "../CommandResult.js"
import succeeds from "../utils/succeeds.js"
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
        "User-Agent": "phylopic/2.0 (http://phylopic.org/; keesey+phylopic@gmail.com) phylopic-publish/0.0.0",
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
const hasNamebankLink = (externals: CLIData["externals"], nodeUUID: UUID) => {
    return [...externals.entries()].some(
        ([path, { href }]) => href === `/nodes/${nodeUUID}` && path.startsWith("ubio.org/namebank/"),
    )
}
const getNamebankIDs = (cliData: CLIData, nodeUUID: UUID) => {
    return [...cliData.externals.entries()]
        .filter(([path, { href }]) => href === `/nodes/${nodeUUID}` && path.startsWith("ubio.org/namebank/"))
        .map(([path]) => parseInt(path.slice("ubio.org/namebank/".length, 10)))
        .sort()
}
const getParentEOLPageIDs = (cliData: CLIData, node: Node): readonly number[] => {
    const parentUUID = node.parent
    if (!parentUUID) {
        return []
    }
    const ids = getNamebankIDs(cliData, parentUUID)
    if (ids.length > 0) {
        return ids
    }
    const parentNode = cliData.nodes.get(parentUUID)
    if (!parentNode) {
        return []
    }
    return getParentEOLPageIDs(cliData, parentNode)
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
const processEOLEntry = async (
    cliData: CLIData,
    externals: Map<UUID, TitledLink>,
    sourceUpdates: SourceUpdate[],
    entry: Readonly<[UUID, Node]>,
) => {
    const [uuid, node] = entry
    const parentID = getParentEOLPageIDs(cliData, node)[0]
    const matches = await getFirstEOLSearchMatch(node.names, parentID)
    if (matches?.length === 1) {
        const { id } = matches[0]
        const title = normalizeText(matches[0].title)
        const body = JSON.stringify({
            href: `/nodes/${uuid}`,
            title,
        })
        const path = `eol.org/pages/${id}`
        if (externals.has(path) && externals.get(path)?.href !== `/nodes/${uuid}`) {
            console.warn(`Match found for EOL ID ${id} (${title}), but it is already assigned to another node.`)
        } else {
            externals.set(path, {
                href: `/nodes/${uuid}`,
                title,
            })
            sourceUpdates.push(
                new PutObjectCommand({
                    Bucket: SOURCE_BUCKET_NAME,
                    Body: body,
                    ContentType: "application/json",
                    Key: `externals/${path}/meta.json`,
                }),
            )
        }
    }
}
const processEOL = async (
    cliData: CLIData,
    externals: Map<UUID, TitledLink>,
    sourceUpdates: SourceUpdate[],
    entries: [UUID, Node][],
) => {
    for (const entry of entries) {
        try {
            await processEOLEntry(cliData, externals, sourceUpdates, entry)
        } catch (e) {
            console.warn(`Error looking up ${stringifyNomen(entry[1].names[0])} <${entry[0]}>:`, e)
        }
    }
}
const processNamebank = async (
    cliData: CLIData,
    externals: Map<UUID, TitledLink>,
    sourceUpdates: SourceUpdate[],
    entries: [UUID, Node][],
) => {
    for (const [uuid, node] of entries) {
        try {
            const paths = await getPathsFromNamebank(new Set(getNamebankIDs(cliData, uuid)))
            if (paths.length === 0) {
                await processEOLEntry(cliData, externals, sourceUpdates, [uuid, node])
            } else {
                const external = { href: `/nodes/${uuid}`, title: stringifyNomen(node.names[0]) }
                const body = stringifyNormalized(external)
                for (const path of paths) {
                    if (externals.has(path) && externals.get(path)?.href !== `/nodes/${uuid}`) {
                        console.warn(
                            `Match found for ${path} (${external.title}), but it is already assigned to another node.`,
                        )
                    } else {
                        externals.set(path, external)
                        sourceUpdates.push(
                            new PutObjectCommand({
                                Bucket: SOURCE_BUCKET_NAME,
                                Body: body,
                                ContentType: "application/json",
                                Key: `externals/${path}/meta.json`,
                            }),
                        )
                    }
                }
            }
        } catch (e) {
            console.warn(`Error looking up ${stringifyNomen(node.names[0])} <${uuid}>:`, e)
        }
    }
}
const getCandidates = (cliData: CLIData, root: Entity<Node>) => {
    const uuidsWithEOLLinks = new Set(
        [...cliData.externals.entries()]
            .filter(([path]) => path.startsWith("eol.org/pages/"))
            .map(([, external]) => external.href.replace(/^\/nodes\//, ""))
            .filter(uuid => isUUID(uuid)),
    )
    const candidates = [...cliData.nodes.entries()]
        .filter(([uuid]) => !uuidsWithEOLLinks.has(uuid))
        .filter(([uuid, node]) => succeeds(cliData.nodes, root.uuid, { uuid, value: node }))
        .filter(([, node]) => node.names.some(isScientific))
    return candidates
}
const autolinkEOL = async (cliData: CLIData, root: Entity<Node>): Promise<CommandResult> => {
    const sourceUpdates: SourceUpdate[] = []
    const externals = new Map<string, TitledLink>([...cliData.externals.entries()])
    const candidates = getCandidates(cliData, root)
    console.info(`Processing ${candidates.length} node${candidates.length === 1 ? "" : "s"}...`)
    const [namebankCandidates, otherCandidates] = candidates.reduce<[[UUID, Node][], [UUID, Node][]]>(
        ([namebank, other], entry) =>
            hasNamebankLink(cliData.externals, entry[0])
                ? [[...namebank, entry], other]
                : [namebank, [...other, entry]],
        [[], []],
    )
    await Promise.all([
        processNamebank(cliData, externals, sourceUpdates, namebankCandidates),
        processEOL(cliData, externals, sourceUpdates, otherCandidates),
    ])
    console.info(`Processed ${candidates.length} node${candidates.length === 1 ? "" : "s"}.`)
    return {
        cliData: {
            ...cliData,
            externals,
        },
        sourceUpdates,
    }
}
export default autolinkEOL
