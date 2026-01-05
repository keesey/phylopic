import { Node } from "@phylopic/source-models"
import { normalizeNomina, normalizeUUID, UUID } from "@phylopic/utils"
import axios from "axios"
import { randomUUID } from "crypto"
import { parseNomen } from "parse-nomen"
import SourceClient from "~/source/SourceClient"
import { Resolver } from "../Resolver"
interface OTOLLineageItem {
    // Abridged.
    readonly name: string
    readonly ott_id: number
    readonly synonyms?: readonly string[]
    readonly unique_name: string
}
interface OTOLTaxonInfo {
    // Abridged.
    readonly synonyms?: readonly string[]
    readonly lineage?: readonly OTOLLineageItem[]
    readonly name: string
    readonly ott_id: number
    readonly unique_name: string
}
const resolveItem = async (client: SourceClient, item: OTOLLineageItem, lineage: readonly OTOLLineageItem[]) => {
    const externalClient = client.external("opentreeoflife.org", "taxonomy", String(item.ott_id))
    if (await externalClient.exists()) {
        const external = await externalClient.get()
        const node = await client.node(external.node).get()
        return node
    }
    const now = new Date().toISOString()
    const newNode: Node & { uuid: UUID } = {
        created: now,
        modified: now,
        names: normalizeNomina([item.name, ...(item.synonyms ?? [])].map(name => parseNomen(name))),
        parent: (await resolveItem(client, lineage[0], lineage.slice(1))).uuid,
        uuid: normalizeUUID(randomUUID()),
    }
    await client.node(newNode.uuid).put(newNode)
    await externalClient.put({
        authority: "opentreeoflife.org",
        namespace: "taxonomy",
        node: newNode.uuid,
        objectID: String(item.ott_id),
        title: item.unique_name || item.name,
    })
    return newNode
}
const resolveOTOL: Resolver = async (client, objectID) => {
    const result = await axios.post<OTOLTaxonInfo>(
        "https://api.opentreeoflife.org/v3/taxonomy/taxon_info",
        {
            include_lineage: true,
            ott_id: parseInt(objectID, 10),
        },
        {
            headers: { accept: "application/json", "content-type": "application/json" },
            responseType: "json",
        },
    )
    const node = await resolveItem(client, result.data, result.data.lineage ?? [])
    return node
}
export default resolveOTOL
