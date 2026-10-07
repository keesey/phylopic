import {
    buildRadialCladogramLayout,
    renderRadialCladogramSvg,
    type BuildRadialCladogramLayoutOptions,
    type RadialCladogramLayoutGeometry,
    type RadialNodeArt,
    type RadialRadiusMode,
    type TolColorScheme,
} from "@phylopic/diagrams"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { buildDiagramPublicationForImageUuids } from "./buildDiagramPublicationForImages.js"
import { pickImage } from "./pickImage.js"
import {
    resolveLabeledTipRadialSilhouettes,
    silhouetteIdsToLayoutOptions,
} from "./resolveLabeledTipRadialSilhouettes.js"
import type { CladogramTreeNode, LicenseFilters } from "./types.js"

export type RenderRadialCladogramFromTreeInput = Readonly<{
    root: CladogramTreeNode
    tipCount: number
    diagramTitle: string
    radiusMode?: RadialRadiusMode
    outerLayoutRadius?: number
    forceTipLabels?: boolean
    maxLegendSpanDeg?: number
    tolScheme?: TolColorScheme
    /** When true, skip PhyloPic resolve/picks (labels and geometry only). */
    skipResolve?: boolean
    /** When true with skipResolve, same as label-only CLI. */
    labelOnly?: boolean
    licenseFilters?: LicenseFilters
    onDiagnostic?: (line: string) => void
}>

export type RenderRadialCladogramFromTreeResult = Readonly<{
    svg: string
    layout: RadialCladogramLayoutGeometry
    nodeArtById: Record<string, RadialNodeArt | null>
}>

const mergeNodeUuidsIntoArt = (
    nodeArtById: Record<string, RadialNodeArt | null>,
    nodeUuids: Record<string, string>,
) => {
    for (const [id, uuid] of Object.entries(nodeUuids)) {
        if (nodeArtById[id] && nodeArtById[id] !== null) {
            nodeArtById[id] = { ...nodeArtById[id]!, nodeUuid: uuid }
        } else if (!nodeArtById[id]) {
            nodeArtById[id] = { nodeUuid: uuid }
        }
    }
}

const usedImageUuids = (nodeArtById: Record<string, RadialNodeArt | null>): string[] => [
    ...new Set(
        Object.values(nodeArtById)
            .map(a => a?.imageUuid)
            .filter((u): u is string => Boolean(u)),
    ),
]

export const renderRadialCladogramFromTree = async (
    client: PhyloPicClient,
    input: RenderRadialCladogramFromTreeInput,
): Promise<RenderRadialCladogramFromTreeResult> => {
    const onDiagnostic = input.onDiagnostic ?? (() => {})
    const filters = input.licenseFilters ?? { filter_license_nc: "false" as const }
    const skipResolve = input.skipResolve ?? input.labelOnly ?? false

    let nodeArtById: Record<string, RadialNodeArt | null> = {}
    let nodeUuids: Record<string, string> = {}
    let silhouetteLayout: Pick<
        BuildRadialCladogramLayoutOptions,
        "directTipSilhouetteNodeIds" | "cladeRimSilhouetteNodeIds"
    > = {}

    if (!skipResolve) {
        const plan = await resolveLabeledTipRadialSilhouettes(client, input.root, filters, onDiagnostic)
        nodeArtById = plan.nodeArtById
        nodeUuids = plan.nodeUuids
        silhouetteLayout = silhouetteIdsToLayoutOptions(
            plan.directTipSilhouetteNodeIds,
            plan.cladeRimSilhouetteNodeIds,
        )
    }

    const layoutOptions: BuildRadialCladogramLayoutOptions = {
        tipCount: input.tipCount,
        ...(input.radiusMode ? { radiusMode: input.radiusMode } : {}),
        ...(input.outerLayoutRadius !== undefined ? { outerLayoutRadius: input.outerLayoutRadius } : {}),
        ...(input.forceTipLabels ? { forceTipLabels: true } : {}),
        ...(input.maxLegendSpanDeg !== undefined ? { maxLegendSpanDeg: input.maxLegendSpanDeg } : {}),
        ...(input.tolScheme ? { tolScheme: input.tolScheme } : {}),
        ...silhouetteLayout,
    }

    const layout = buildRadialCladogramLayout(input.root, layoutOptions)

    onDiagnostic(
        `Parsed ${input.tipCount} tips; radial${layout.cladeKeyMode ? " (clade key — no tip labels)" : ""}${input.radiusMode === "branchLength" ? " (Newick branch lengths)" : ""}${input.labelOnly ? " label-only" : ""}`,
    )

    if (!input.labelOnly && !skipResolve && layout.cladeKeyMode) {
        for (const leg of layout.legendSilhouettes) {
            const uuid = nodeUuids[leg.nodeId]
            if (!uuid) continue
            try {
                const pick = await pickImage(client, uuid, filters)
                if (pick.image) {
                    nodeArtById[leg.nodeId] = {
                        vectorUrl: pick.image.vectorUrl,
                        imageUuid: pick.image.uuid,
                        nodeUuid: uuid,
                    }
                }
            } catch {
                /* gap */
            }
        }
    }

    mergeNodeUuidsIntoArt(nodeArtById, nodeUuids)

    const imageUuids = usedImageUuids(nodeArtById)
    let publication: Parameters<typeof renderRadialCladogramSvg>[0]["publication"]
    if (imageUuids.length > 0) {
        const built = await buildDiagramPublicationForImageUuids(
            client,
            imageUuids,
            input.diagramTitle,
            layout.contentPad * 2,
        )
        publication = {
            descText: built.descText,
            metadataXml: built.metadataXml,
            footerSvgFragment: built.footerSvgFragment,
            footerBlockHeight: built.footerBlockHeight,
            viewBoxWidth: built.viewBoxWidth,
        }
    }

    const svg = await renderRadialCladogramSvg({
        root: input.root,
        tipCount: input.tipCount,
        diagramTitle: input.diagramTitle,
        layoutOptions,
        nodeArtById,
        publication,
    })

    onDiagnostic(
        `Done (${layout.tipSilhouettes.length} silhouette placement(s) on outer ring)`,
    )

    return { svg, layout, nodeArtById }
}
