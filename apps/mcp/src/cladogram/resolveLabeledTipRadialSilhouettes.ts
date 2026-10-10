import type { BuildRadialCladogramLayoutOptions, RadialNodeArt } from "@phylopic/diagrams"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { collectLabeledTips } from "./collectLabeledTips.js"
import { pickImage } from "./pickImage.js"
import { planRadialCladeRimSilhouetteNodeIds } from "./planRadialCladeRimSilhouettes.js"
import {
    buildResolvableCladeCatalog,
    formatSmallestResolvableSupercladeReport,
} from "./resolvableCladeCatalog.js"
import { resolveCladogramTreeNodeUuids } from "./resolveCladogramTreeNodeUuids.js"
import type { CladogramTreeNode, LicenseFilters } from "./types.js"

export type LabeledTipRadialSilhouettePlan = Readonly<{
    nodeArtById: Record<string, RadialNodeArt | null>
    nodeUuids: Record<string, string>
    directTipSilhouetteNodeIds: readonly string[]
    cladeRimSilhouetteNodeIds: readonly string[]
}>

const pickForNewickNode = async (
    client: PhyloPicClient,
    nodeArtById: Record<string, RadialNodeArt | null>,
    nodeId: string,
    phylopicUuid: string,
    filters: LicenseFilters,
    cladeListOnly: boolean,
) => {
    try {
        const pick = await pickImage(client, phylopicUuid, {
            ...filters,
            ...(cladeListOnly ? { clade_list_only: true } : {}),
        })
        if (pick.image?.vectorUrl) {
            nodeArtById[nodeId] = {
                vectorUrl: pick.image.vectorUrl,
                imageUuid: pick.image.uuid,
                nodeUuid: phylopicUuid,
            }
        } else {
            nodeArtById[nodeId] = { nodeUuid: phylopicUuid }
        }
    } catch {
        nodeArtById[nodeId] = { nodeUuid: phylopicUuid }
    }
}

/** SRC catalog, trusted tip picks, clade-scoped internal picks, and rim placement ids. */
export const resolveLabeledTipRadialSilhouettes = async (
    client: PhyloPicClient,
    root: CladogramTreeNode,
    filters: LicenseFilters,
    onDiagnostic: (line: string) => void = () => {},
): Promise<LabeledTipRadialSilhouettePlan> => {
    const catalog = await buildResolvableCladeCatalog(client, root)
    for (const line of formatSmallestResolvableSupercladeReport(catalog.assignments)) {
        onDiagnostic(line)
    }

    const nodeArtById: Record<string, RadialNodeArt | null> = {}
    let nodeUuids = await resolveCladogramTreeNodeUuids(client, root, {
        onWarning: onDiagnostic,
    })

    for (const tip of collectLabeledTips(root)) {
        const phylopicUuid = nodeUuids[tip.id]
        if (!phylopicUuid) continue
        await pickForNewickNode(client, nodeArtById, tip.id, phylopicUuid, filters, false)
    }

    for (const [nodeId, phylopicUuid] of Object.entries(catalog.nodeAssignment)) {
        nodeUuids[nodeId] = phylopicUuid
        if (nodeArtById[nodeId]?.vectorUrl) continue
        await pickForNewickNode(client, nodeArtById, nodeId, phylopicUuid, filters, true)
    }

    const directTipSilhouetteNodeIds = collectLabeledTips(root)
        .filter(t => Boolean(nodeArtById[t.id]?.vectorUrl))
        .map(t => t.id)

    const cladeRimSilhouetteNodeIds = planRadialCladeRimSilhouetteNodeIds(
        root,
        id => Boolean(nodeArtById[id]?.vectorUrl),
        { tipsWithDirectSilhouettes: directTipSilhouetteNodeIds },
    )

    onDiagnostic(
        `Silhouettes: ${directTipSilhouetteNodeIds.length} tip(s), ${cladeRimSilhouetteNodeIds.length} clade rim`,
    )

    return { nodeArtById, nodeUuids, directTipSilhouetteNodeIds, cladeRimSilhouetteNodeIds }
}

export const silhouetteIdsToLayoutOptions = (
    directTipSilhouetteNodeIds: readonly string[],
    cladeRimSilhouetteNodeIds: readonly string[],
): Pick<
    BuildRadialCladogramLayoutOptions,
    "directTipSilhouetteNodeIds" | "cladeRimSilhouetteNodeIds"
> => ({
    ...(directTipSilhouetteNodeIds.length ? { directTipSilhouetteNodeIds } : {}),
    ...(cladeRimSilhouetteNodeIds.length ? { cladeRimSilhouetteNodeIds } : {}),
})
