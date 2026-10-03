import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { fetchLineageUuids } from "./fetchLineageUuids.js"
import { mostLeafwardCommonAncestor } from "./mostLeafwardCommonAncestor.js"

export type ResolveMrcaResult = Readonly<{
    mrcaUuid: string | null
    warnings: readonly string[]
}>

export const resolveMrcaFromDescendants = async (
    client: PhyloPicClient,
    descendantNodeUuids: readonly string[],
): Promise<ResolveMrcaResult> => {
    const warnings: string[] = []
    const unique = [...new Set(descendantNodeUuids.filter(Boolean))]
    if (!unique.length) {
        return { mrcaUuid: null, warnings: ["No descendant node UUIDs provided."] }
    }
    if (unique.length === 1) {
        warnings.push("Single descendant UUID; using that node as the clade representative.")
        return { mrcaUuid: unique[0], warnings }
    }

    const lineages = await Promise.all(unique.map(uuid => fetchLineageUuids(client, uuid)))
    const mrcaUuid = mostLeafwardCommonAncestor(lineages)
    if (!mrcaUuid) {
        warnings.push("Could not determine a common ancestor from descendant lineages.")
    } else {
        warnings.push(`Resolved most leafward common ancestor ${mrcaUuid} from ${unique.length} descendant lineages.`)
    }
    return { mrcaUuid, warnings }
}
