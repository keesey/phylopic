import { iterateList, SourceClient } from "@phylopic/source-client"
import { Node } from "@phylopic/source-models"
import { createSearch, getIdentifier, isScientific, Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import axios from "axios"
type GBIFRank = "species" | "genus" | "family" | "order" | "class" | "phylum" | "kingdom"
type GBIFNameUsage = Readonly<Partial<Record<GBIFRank, string>>> &
    Readonly<Partial<Record<`${GBIFRank}Key`, number>>> &
    Partial<
        Readonly<{
            canonicalName: string
            higherClassificationMap: Readonly<Record<string, string>>
            key: number
            nameKey: number
            nubKey: number
            parent: string
            parentKey: number
            rank: string
            scientificName: string
            status: string
            synonym: boolean
        }>
    >
type GBIFMatch = Omit<GBIFNameUsage, "key"> & {
    matchType: "EXACT" | "FUZZY" | "NONE"
    usageKey?: number
}
type GBIFPage = {
    count: number
    endOfRecords: boolean
    limit: number
    offset: number
    results: readonly GBIFNameUsage[]
}
type Ancestry = Partial<Record<GBIFRank, number>>
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
const EXCLUDED_IDS: readonly number[] = [0, 2, 4, 7]
const sanitizeID = (x: number | undefined) => (typeof x === "number" && !EXCLUDED_IDS.includes(x) ? x : undefined)
const processNode = async (client: SourceClient, node: Node & { uuid: UUID }, ancestry: Ancestry) => {
    let mainUsage: GBIFNameUsage | undefined
    const page = await client.node(node.uuid).externals.namespace("gbif.org", "species").page()
    if (page.items.length) {
        mainUsage = (
            await axios.get<GBIFNameUsage>(
                `https://api.gbif.org/v1/species/${encodeURIComponent(page.items[0].objectID)}`,
            )
        ).data
    } else {
        const names = getScientificNames(node.names)
        for (const name of names) {
            const search = {
                ...ancestry,
                name,
                strict: true,
            }
            const response = await axios.get<GBIFMatch>(`https://api.gbif.org/v1/species/match${createSearch(search)}`)
            if (response.data.matchType === "EXACT" && typeof response.data.usageKey === "number") {
                if (!mainUsage) {
                    mainUsage = response.data
                }
                const id = String(response.data.usageKey)
                const externalClient = client.external("gbif.org", "species", id)
                if (await externalClient.exists()) {
                    console.info(`${getIdentifier("gbif.org", "species", id)} is already assigned.`)
                } else {
                    console.info(
                        `${getIdentifier("gbif.org", "species", id)} (${
                            response.data.canonicalName
                        }) => phylopic.org/nodes/${node.uuid} (${stringifyNomen(node.names[0])})`,
                    )
                    await externalClient.put({
                        authority: "gbif.org",
                        namespace: "species",
                        node: node.uuid,
                        objectID: id,
                        title: response.data.canonicalName ?? response.data.scientificName ?? "",
                    })
                }
            }
        }
    }
    if (mainUsage) {
        ancestry = {
            kingdom: sanitizeID(mainUsage.kingdomKey),
            phylum: sanitizeID(mainUsage.phylumKey),
            class: sanitizeID(mainUsage.classKey),
            order: sanitizeID(mainUsage.orderKey),
            family: sanitizeID(mainUsage.familyKey),
            genus: sanitizeID(mainUsage.genusKey),
            species: sanitizeID(mainUsage.speciesKey),
        }
    }
    for await (const child of iterateList(client.node(node.uuid).children)) {
        await processNode(client, child, ancestry)
    }
}
const autolinkGBIF = async (client: SourceClient): Promise<void> => {
    const node = await client.root.get()
    await processNode(client, node, {})
}
export default autolinkGBIF
