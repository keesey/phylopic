import { Node } from "@phylopic/source-models"
import { isDefined, isFiniteNumber, normalizeNomina, normalizeUUID, UUID } from "@phylopic/utils"
import axios from "axios"
import { randomUUID } from "crypto"
import { parseNomen } from "parse-nomen"
import SourceClient from "~/source/SourceClient"
import { Resolver } from "../Resolver"
export type GBIFRank = "species" | "genus" | "family" | "order" | "class" | "phylum" | "kingdom"
export type GBIFNameUsage = Readonly<Partial<Record<GBIFRank, string>>> &
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
const resolveParent = async (
    client: SourceClient,
    lineage: readonly number[],
): Promise<(Node & { uuid: UUID }) | null> => {
    if (!lineage.length) {
        return null
    }
    const externalClient = client.external("gbif.org", "species", String(lineage[0]))
    if (await externalClient.exists()) {
        const external = await externalClient.get()
        return await client.node(external.node).get()
    }
    return resolveParent(client, lineage.slice(1))
}
const resolveItem = async (client: SourceClient, item: GBIFNameUsage, lineage: readonly number[]) => {
    const externalClient = client.external("gbif.org", "species", String(item.key))
    if (await externalClient.exists()) {
        const external = await externalClient.get()
        return await client.node(external.node).get()
    }
    const now = new Date().toISOString()
    const parent = await resolveParent(client, lineage)
    const newNode: Node & { uuid: UUID } = {
        created: now,
        modified: now,
        names: normalizeNomina(
            [item.scientificName, item.canonicalName].filter(isDefined).map(name => parseNomen(name)),
        ),
        parent: parent ? parent.uuid : null,
        uuid: normalizeUUID(randomUUID()),
    }
    await client.node(newNode.uuid).put(newNode)
    await externalClient.put({
        authority: "gbif.org",
        namespace: "species",
        node: newNode.uuid,
        objectID: String(item.key),
        title: item.scientificName ?? item.canonicalName ?? "[Unnamed]",
    })
    return newNode
}
const resolveGBIF: Resolver = async (client, objectID) => {
    const result = await axios.get<GBIFNameUsage>(`https://api.gbif.org/v1/species/${encodeURIComponent(objectID)}`, {
        responseType: "json",
    })
    const node = await resolveItem(
        client,
        result.data,
        [
            result.data.speciesKey,
            result.data.genusKey,
            result.data.familyKey,
            result.data.orderKey,
            result.data.classKey,
            result.data.phylumKey,
            result.data.kingdomKey,
        ]
            .filter(isFiniteNumber)
            .filter((value, index, array) => value !== result.data.key && !array.slice(0, index).includes(value)),
    )
    return node
}
export default resolveGBIF
