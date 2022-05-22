import { PutObjectCommand } from "@aws-sdk/client-s3"
import { TitledLink } from "@phylopic/api-models"
import { Entity, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isScientific, Nomen, normalizeText, stringifyNormalized, UUID } from "@phylopic/utils"
import axios from "axios"
import type { CLIData } from "../../getCLIData.js"
import { CommandResult, SourceUpdate } from "../CommandResult.js"
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
const hasOTOLLink = (externals: CLIData["externals"], nodeUUID: UUID) => {
    return [...externals.entries()].some(
        ([path, { href }]) => href === `/nodes/${nodeUUID}` && path.startsWith("opentreeoflife.org/taxonomy/"),
    )
}
const succeeds = (nodes: CLIData["nodes"], predecessorUUID: UUID, entity: Entity<Node>): boolean => {
    if (entity.uuid === predecessorUUID) {
        return true
    }
    const parentUUID = entity.value.parent
    if (!parentUUID) {
        return false
    }
    const parent = nodes.get(parentUUID)
    if (!parent) {
        return false
    }
    return succeeds(nodes, predecessorUUID, { uuid: parentUUID, value: parent })
}
const findContext = (cliData: CLIData, entity: Entity<Node>): string | undefined => {
    const external = [...cliData.externals.entries()].find(
        ([path, { href }]) => href === `/nodes/${entity.uuid}` && path.startsWith("opentreeoflife.org/contexts/"),
    )
    if (external) {
        return decodeURIComponent(external[0].split("/", 3)[2])
    }
    if (entity.value.parent) {
        const parent = cliData.nodes.get(entity.value.parent)
        if (parent) {
            return findContext(cliData, { uuid: entity.value.parent, value: parent })
        }
    }
}
const AUTHORITY_ABBRS: Readonly<Record<string, Readonly<[string, string]>> | undefined> = {
    gbif: ["gbif.org", "species"],
    ncbi: ["ncbi.nlm.nih.gov", "taxid"],
    irmng: ["irmng.org", "taxname"],
    worms: ["marinespecies.org", "taxname"],
}
const getExternalEntries = (taxon: OTOLTaxon, uuid: UUID) => {
    const map = new Map<string, TitledLink>()
    map.set(`opentreeoflife.org/taxonomy/${encodeURIComponent(String(taxon.ott_id))}`, {
        href: `/nodes/${uuid}`,
        title: taxon.unique_name,
    })
    for (const source of taxon.tax_sources) {
        const [authorityAbbr, objectID] = source.split(":")
        const namespace = AUTHORITY_ABBRS[authorityAbbr]
        if (namespace) {
            map.set([...namespace, objectID].map(encodeURIComponent).join("/"), {
                href: `/nodes/${uuid}`,
                title: normalizeText(taxon.unique_name),
            })
        }
    }
    return [...map.entries()]
}
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
const autolinkOTOL = async (cliData: CLIData, root: Entity<Node>): Promise<CommandResult> => {
    const sourceUpdates: SourceUpdate[] = []
    const externals = new Map<string, TitledLink>([...cliData.externals.entries()])
    const nodeEntries = [...cliData.nodes.entries()].filter(
        ([uuid, node]) =>
            node.names.some(isScientific) &&
            !hasOTOLLink(cliData.externals, uuid) &&
            succeeds(cliData.nodes, root.uuid, { uuid, value: node }),
    )
    console.info(`Processing ${nodeEntries.length} node${nodeEntries.length === 1 ? "" : "s"}...`)
    await Promise.all(
        nodeEntries.map(async ([nodeUUID, node]) => {
            const context = findContext(cliData, { uuid: nodeUUID, value: node })
            const names = getScientificNames(node.names)
            try {
                const response = await axios.post<OTOLMatchedNames>(
                    "https://api.opentreeoflife.org/v3/tnrs/match_names",
                    {
                        names,
                        ...(context ? { context_name: context } : null),
                    },
                )
                const results = response.data.results.filter(result =>
                    response.data.unambiguous_names.includes(result.name),
                )
                for (const result of results) {
                    for (const match of result.matches) {
                        for (const [path, external] of getExternalEntries(match.taxon, nodeUUID)) {
                            if (externals.has(path) && externals.get(path)?.href !== external.href) {
                                console.warn(
                                    `Match found for OTT ID ${match.taxon.ott_id} (${match.taxon.unique_name}), but it is already assigned to another node.`,
                                )
                            } else {
                                externals.set(path, external)
                                sourceUpdates.push(
                                    new PutObjectCommand({
                                        Bucket: SOURCE_BUCKET_NAME,
                                        Body: stringifyNormalized(external),
                                        ContentType: "application/json",
                                        Key: `externals/${path}/meta.json`,
                                    }),
                                )
                            }
                        }
                    }
                }
                console.info(`Processed ${names[0]} <${nodeUUID}>.`)
            } catch (e) {
                console.warn(`Error looking up ${names[0]} <${nodeUUID}>:`, e)
            }
        }),
    )
    console.info(`Processed ${nodeEntries.length} node${nodeEntries.length === 1 ? "" : "s"}.`)
    return {
        cliData: {
            ...cliData,
            externals,
        },
        sourceUpdates,
    }
}
export default autolinkOTOL
