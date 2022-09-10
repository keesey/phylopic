import { iterateList, SourceClient } from "@phylopic/source-client"
import { External, Node } from "@phylopic/source-models"
import {
    Authority,
    getIdentifier,
    isScientific,
    Namespace,
    Nomen,
    normalizeText,
    ObjectID,
    stringifyNomen,
    UUID,
} from "@phylopic/utils"
import axios from "axios"
interface OTOLTaxon {
    ott_id: number
    tax_sources: string[]
    unique_name: string
}
interface OTOLMatch {
    taxon: OTOLTaxon
}
interface OTOLMatchedNamesResult {
    matches: OTOLMatch[]
    name: string
}
interface OTOLMatchedNames {
    results: OTOLMatchedNamesResult[]
    unambiguous_names: string[]
}
const findContextObjectID = async (client: SourceClient, nodeUUID: UUID): Promise<ObjectID | undefined> => {
    const nodeClient = client.node(nodeUUID)
    const page = await nodeClient.externals.namespace("opentreeoflife.org", "contexts").page()
    if (page.items.length) {
        return decodeURIComponent(page.items[0].objectID)
    }
    for await (const predecessor of iterateList(nodeClient.lineage)) {
        if (predecessor.uuid !== nodeUUID) {
            const prcPage = await client
                .node(predecessor.uuid)
                .externals.namespace("opentreeoflife.org", "contexts")
                .page()
            if (prcPage.items.length) {
                return decodeURIComponent(prcPage.items[0].objectID)
            }
        }
    }
}
const AUTHORITY_ABBRS: Readonly<Record<string, Readonly<[string, string]>> | undefined> = {
    gbif: ["gbif.org", "species"],
    ncbi: ["ncbi.nlm.nih.gov", "taxid"],
    irmng: ["irmng.org", "taxname"],
    worms: ["marinespecies.org", "taxname"],
}
const getExternals = (
    taxon: OTOLTaxon,
    nodeUUID: UUID,
): ReadonlyArray<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> => {
    const result: Array<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> = []
    result.push({
        authority: "opentreeoflife.org",
        namespace: "taxonomy",
        node: nodeUUID,
        objectID: String(taxon.ott_id),
        title: taxon.unique_name,
    })
    for (const source of taxon.tax_sources) {
        const [authorityAbbr, objectID] = source.split(":")
        const namespace = AUTHORITY_ABBRS[authorityAbbr]
        if (namespace) {
            result.push({
                authority: namespace[0],
                namespace: namespace[1],
                node: nodeUUID,
                objectID,
                title: normalizeText(taxon.unique_name),
            })
        }
    }
    return result
}
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
const autolinkOTOL = async (client: SourceClient): Promise<void> => {
    let nodes: Array<Node & { uuid: UUID }> = []
    for await (const node of iterateList(client.nodes)) {
        if (node.names.some(isScientific)) {
            nodes.push(node)
        }
    }
    console.info(`Starting with ${nodes.length} node${nodes.length === 1 ? "" : "s"}...`)
    for await (const external of iterateList(client.externals("opentreeoflife.org", "taxonomy"))) {
        nodes = nodes.filter(node => node.uuid !== external.node)
    }
    console.info(`Processing ${nodes.length} node${nodes.length === 1 ? "" : "s"}...`)
    await Promise.all(
        nodes.map(async node => {
            const names = getScientificNames(node.names)
            const contextObjectID = await findContextObjectID(client, node.uuid)
            try {
                const response = await axios.post<OTOLMatchedNames>(
                    "https://api.opentreeoflife.org/v3/tnrs/match_names",
                    {
                        names,
                        ...(contextObjectID ? { context_name: contextObjectID } : null),
                    },
                )
                const results = response.data.results.filter(result =>
                    response.data.unambiguous_names.includes(result.name),
                )
                for (const result of results) {
                    for (const match of result.matches) {
                        for (const external of getExternals(match.taxon, node.uuid)) {
                            const externalClient = client.external(
                                external.authority,
                                external.namespace,
                                external.objectID,
                            )
                            const exists = await externalClient.exists()
                            const existingNodeUUID = exists ? (await externalClient.get()).node : null
                            if (existingNodeUUID && existingNodeUUID !== node.uuid) {
                                console.warn(
                                    `Match found for OTT ID ${match.taxon.ott_id} (${match.taxon.unique_name}), but it is already assigned to another node.`,
                                )
                            } else {
                                console.info(
                                    `${getIdentifier(external.authority, external.namespace, external.objectID)} (${
                                        external.title
                                    }) => phylopic.org/nodes/${node.uuid} (${stringifyNomen(node.names[0])})`,
                                )
                                externalClient.put(external)
                            }
                        }
                    }
                }
                console.info(`Processed ${names[0]} <${node.uuid}>.`)
            } catch (e) {
                console.warn(`Error looking up ${names[0]} <${node.uuid}>:`, e)
            }
        }),
    )
    console.info(`Processed ${nodes.length} node${nodes.length === 1 ? "" : "s"}.`)
}
export default autolinkOTOL
