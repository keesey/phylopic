import { UUID } from "@phylopic/utils"
import axios from "axios"
import { parseNomen } from "parse-nomen"
import { Resolver } from "../Resolver"
interface OTOLLineageItem {
    // Abridged.
    readonly ott_id: number
}
interface OTOLTaxonInfo {
    // Abridged.
    readonly lineage?: readonly OTOLLineageItem[]
    readonly name: string
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
    const name = result.data.name
    let parent: UUID | null = null
    if (result.data.lineage) {
        for (const ancestor of result.data.lineage) {
            const externalClient = client.external("opentreeoflife.org", "taxonomy", String(ancestor.ott_id))
            if (await externalClient.exists()) {
                const external = await externalClient.get()
                parent = external.node
            }
        }
    }
    return {
        names: [parseNomen(name)],
        parent,
    }
}
export default resolveOTOL
