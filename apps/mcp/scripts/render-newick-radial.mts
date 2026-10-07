/**
 * Radial cladogram from Newick → ~/Downloads/experiments/
 * Env: NEWICK or NEWICK_FILE, OUTPUT, TITLE, RADIAL_RADIUS_MODE=branchLength, TIP_RADIUS, …
 */
import type { ImageWithEmbedded } from "@phylopic/api-models"
import {
    buildRadialCladogramLayout,
    renderRadialCladogramSvg,
    type RadialNodeArt,
    type RadialRadiusMode,
    type TolColorScheme,
} from "@phylopic/diagrams"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import type { CladogramTreeNode } from "../src/cladogram/types.js"
import { parseNewickToTree } from "../src/cladogram/parseNewick.js"
import { pickImage } from "../src/cladogram/pickImage.js"
import { planRadialCladeRimSilhouetteNodeIds } from "../src/cladogram/planRadialCladeRimSilhouettes.js"
import {
    buildResolvableCladeCatalog,
    formatSmallestResolvableSupercladeReport,
} from "../src/cladogram/resolvableCladeCatalog.js"
import { resolveCladogramTreeNodeUuids } from "../src/cladogram/resolveCladogramTreeNodeUuids.js"
import { PhyloPicClient } from "../src/client/PhyloPicClient.js"
import { buildDiagramPublication, diagramWidthForPublication } from "../src/collection/diagramPublication.js"
import { describeImageSetUsage } from "../src/collection/describeImageSetUsage.js"
const NEWICK =
    process.env.NEWICK?.trim() ??
    (process.env.NEWICK_FILE ? readFileSync(process.env.NEWICK_FILE, "utf8").trim() : undefined)
if (!NEWICK) {
    throw new Error("Set NEWICK or NEWICK_FILE.")
}

const maxTips = Number(process.env.MAX_TIPS ?? "5000")
const labelOnly = process.env.LABEL_ONLY === "1" || process.env.LABEL_ONLY === "true"
const skipResolve =
    labelOnly ||
    process.env.SKIP_RESOLVE === "1" ||
    process.env.SKIP_RESOLVE === "true"
const outputName = process.env.OUTPUT?.trim() || "radial-cladogram.svg"
const outDir = join(homedir(), "Downloads", "experiments")
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, outputName)

const filters = { filter_license_nc: "false" as const }
const MAX_LEGEND_SPAN_DEG = process.env.MAX_LEGEND_SPAN_DEG?.trim()

const normalizedNewick = NEWICK.replace(/\s*,\s*/g, ",")
const parsed = parseNewickToTree(normalizedNewick, { maxTips: Number.isFinite(maxTips) ? maxTips : 5000 })
const { root } = parsed
const diagramTitle = process.env.TITLE?.trim() || root.label || "Radial cladogram"
const forceTipLabels = process.env.FORCE_TIP_LABELS === "1" || process.env.FORCE_TIP_LABELS === "true"

const radialRadiusMode = (): RadialRadiusMode => {
    const raw = process.env.RADIAL_RADIUS_MODE?.trim().toLowerCase()
    if (raw === "branchlength" || raw === "branch_length" || raw === "weights") return "branchLength"
    if (process.env.USE_NEWICK_WEIGHTS === "1" || process.env.USE_NEWICK_WEIGHTS === "true") {
        return "branchLength"
    }
    return "equalDepth"
}

const radiusMode = radialRadiusMode()
const outerLayoutRadius = Number(process.env.TIP_RADIUS ?? String(Math.max(420, parsed.tipCount * 0.95)))

const client = new PhyloPicClient()

const collectTips = (n: CladogramTreeNode): CladogramTreeNode[] =>
    n.children.length === 0 ? (n.label ? [n] : []) : n.children.flatMap(collectTips)

const pickForUuid = async (
    nodeId: string,
    phylopicUuid: string,
    options: { cladeListOnly?: boolean } = {},
) => {
    try {
        const pick = await pickImage(client, phylopicUuid, {
            ...filters,
            ...(options.cladeListOnly ? { clade_list_only: true } : {}),
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

const nodeArtById: Record<string, RadialNodeArt | null> = {}
let nodeUuids: Record<string, string> = {}
let cladeRimSilhouetteNodeIds: readonly string[] = []
let directTipSilhouetteNodeIds: readonly string[] = []

const silhouetteLayoutOptions = () => ({
    radiusMode,
    outerLayoutRadius,
    forceTipLabels,
    ...(MAX_LEGEND_SPAN_DEG ? { maxLegendSpanDeg: Number(MAX_LEGEND_SPAN_DEG) } : {}),
    tolScheme: (process.env.TOL_SCHEME?.trim() || "darkRainbow") as TolColorScheme,
    ...(directTipSilhouetteNodeIds.length ? { directTipSilhouetteNodeIds } : {}),
    ...(cladeRimSilhouetteNodeIds.length ? { cladeRimSilhouetteNodeIds } : {}),
})

if (!skipResolve) {
    const catalog = await buildResolvableCladeCatalog(client, root)
    for (const line of formatSmallestResolvableSupercladeReport(catalog.assignments)) {
        console.error(line)
    }

    nodeUuids = await resolveCladogramTreeNodeUuids(client, root, {
        onWarning: msg => console.error(msg),
    })

    // Per-tip silhouettes only for trusted PhyloPic title matches (not SRC fallbacks on the tip spoke).
    for (const tip of collectTips(root)) {
        const phylopicUuid = nodeUuids[tip.id]
        if (!phylopicUuid) continue
        await pickForUuid(tip.id, phylopicUuid)
    }

    for (const [nodeId, phylopicUuid] of Object.entries(catalog.nodeAssignment)) {
        nodeUuids[nodeId] = phylopicUuid
        if (nodeArtById[nodeId]?.vectorUrl) continue
        await pickForUuid(nodeId, phylopicUuid, { cladeListOnly: true })
    }

    directTipSilhouetteNodeIds = collectTips(root)
        .filter(t => Boolean(nodeArtById[t.id]?.vectorUrl))
        .map(t => t.id)

    cladeRimSilhouetteNodeIds = planRadialCladeRimSilhouetteNodeIds(
        root,
        id => Boolean(nodeArtById[id]?.vectorUrl),
        { tipsWithDirectSilhouettes: directTipSilhouetteNodeIds },
    )
    console.error(
        `Silhouettes: ${directTipSilhouetteNodeIds.length} tip(s), ${cladeRimSilhouetteNodeIds.length} clade rim`,
    )
}

const layoutPreview = buildRadialCladogramLayout(root, {
    tipCount: parsed.tipCount,
    ...silhouetteLayoutOptions(),
})

console.error(
    `Parsed ${parsed.tipCount} tips; radial${layoutPreview.cladeKeyMode ? " (clade key — no tip labels)" : ""}${radiusMode === "branchLength" ? " (Newick branch lengths)" : ""}${labelOnly ? " label-only" : ""}`,
)

if (!labelOnly && !skipResolve && layoutPreview.cladeKeyMode) {
    for (const leg of layoutPreview.legendSilhouettes) {
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

for (const [id, uuid] of Object.entries(nodeUuids)) {
    if (nodeArtById[id] && nodeArtById[id] !== null) {
        nodeArtById[id] = { ...nodeArtById[id]!, nodeUuid: uuid }
    } else if (!nodeArtById[id]) {
        nodeArtById[id] = { nodeUuid: uuid }
    }
}

const usedUuids = [
    ...new Set(
        Object.values(nodeArtById)
            .map(a => a?.imageUuid)
            .filter((u): u is string => Boolean(u)),
    ),
]

let publication: Parameters<typeof renderRadialCladogramSvg>[0]["publication"]
if (usedUuids.length > 0) {
    const embedded = await Promise.all(
        usedUuids.map(uuid =>
            client.getJson<ImageWithEmbedded>(`/images/${uuid}`, { embed_specificNode: "true" }),
        ),
    )
    const usage = describeImageSetUsage(embedded)
    let footerWidth = layoutPreview.contentPad * 2 - 48
    let attributionMode: "full_text" | "permalink" | undefined
    let attributionUrl: string | undefined
    if (usage.attributionRequired) {
        const { collectionUuid: newUuid } = await client.createCollection(usedUuids)
        const permalink = await client.createCollectionPermalink(newUuid)
        attributionMode = "permalink"
        attributionUrl = permalink.permalinkUrl
    }
    let publicationBuilt = buildDiagramPublication({
        usage,
        images: embedded,
        footerWidth,
        attributionMode,
        attributionUrl,
        imageUuids: usedUuids,
        diagramTitle,
    })
    let w = diagramWidthForPublication(layoutPreview.contentPad * 2, 24, publicationBuilt)
    if (w > layoutPreview.contentPad * 2) {
        footerWidth = w - 48
        attributionMode = attributionMode
        publicationBuilt = buildDiagramPublication({
            usage,
            images: embedded,
            footerWidth,
            attributionMode,
            attributionUrl,
            imageUuids: usedUuids,
            diagramTitle,
        })
    }
    publication = {
        descText: publicationBuilt.descText,
        metadataXml: publicationBuilt.metadataXml,
        footerSvgFragment: publicationBuilt.footerSvgFragment,
        footerBlockHeight: publicationBuilt.footerBlockHeight,
        viewBoxWidth: w,
    }
}

const svg = await renderRadialCladogramSvg({
    root,
    tipCount: parsed.tipCount,
    diagramTitle,
    layoutOptions: silhouetteLayoutOptions(),
    nodeArtById,
    publication,
})

writeFileSync(outPath, svg)
console.error(
    `Wrote ${outPath} (${layoutPreview.tipSilhouettes.length} silhouette placement(s) on outer ring)`,
)
