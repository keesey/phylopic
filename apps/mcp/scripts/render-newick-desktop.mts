/**
 * One-off experiment renderer (not part of MCP build).
 * NEWICK=... OUTPUT=dinosauria-cladogram.svg npx tsx scripts/render-newick-desktop.mts
 * Optional: CLADE_INDEX_<LabelWithUnderscores>=N (e.g. CLADE_INDEX_Dinosauria=1)
 */
import { writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import {
    collectLabeledSubcladeRootIds,
    collectLabeledSubcladeRootLabels,
    isUnlabeledInternalNode,
} from "../src/cladogram/labeledSubcladeRoots.js"
import { parseNewickToTree } from "../src/cladogram/parseNewick.js"
import { pickImage } from "../src/cladogram/pickImage.js"
import { resolveMrcaFromDescendants } from "../src/cladogram/resolveMrcaFromDescendants.js"
import { resolveLabelViaDescendantPhylogeny } from "../src/cladogram/resolveLabelViaDescendantPhylogeny.js"
import { resolveLabelToNode } from "../src/cladogram/resolveLabelToNode.js"
import type { CladogramTreeNode, PickImageOptions } from "../src/cladogram/types.js"
import { PhyloPicClient } from "../src/client/PhyloPicClient.js"
import { phylopicImagePageUrl, phylopicNodePageUrl } from "../src/cladogram/phylopicWebUrls.js"

const NEWICK = process.env.NEWICK?.trim()
if (!NEWICK) {
    console.error("Set NEWICK to a tree string.")
    process.exit(1)
}

const outputName = process.env.OUTPUT?.trim() || "cladogram.svg"
const rootLabel = parseNewickToTree(NEWICK).root.label ?? "cladogram"

const cladeIndexEnv = (label: string): number | undefined => {
    const key = `CLADE_INDEX_${label.replace(/\s+/g, "_")}`
    const raw = process.env[key]
    if (raw === undefined) return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
}

const IMAGE_OVERRIDES: Record<string, PickImageOptions> = {}
for (const key of Object.keys(process.env)) {
    if (!key.startsWith("CLADE_INDEX_")) continue
    const suffix = key.slice("CLADE_INDEX_".length)
    const label = suffix.replace(/_/g, " ")
    const idx = Number(process.env[key])
    if (Number.isFinite(idx)) {
        IMAGE_OVERRIDES[label] = { filter_license_nc: "false", clade_index: idx }
    }
}

const DX = Number(process.env.DX ?? "85")
const BAND = Number(process.env.BAND ?? "52")
const LINE_GAP = 4
const LABEL_OFFSET = 16
const TIP_LEFT_MARGIN = 8
const FONT_BASE = 'font-family="Georgia, serif" font-size="12"'
/** Vernacular Newick labels (e.g. birds) are lowercase; scientific names are italic. */
const labelFontAttrs = (label: string) =>
    label === label.toLowerCase() && /[a-z]/.test(label) ? FONT_BASE : `${FONT_BASE} font-style="italic"`
const H_STUB = 26
const filters = { filter_license_nc: "false" as const }

type LayoutNode = {
    id: string
    label?: string
    depth: number
    children: LayoutNode[]
    railY?: number
    x?: number
    parent?: LayoutNode
}

const { root } = parseNewickToTree(NEWICK)
const client = new PhyloPicClient()

const clone = (n: ReturnType<typeof parseNewickToTree>["root"], depth: number, parent?: LayoutNode): LayoutNode => {
    const node: LayoutNode = { id: n.id, label: n.label, depth, children: [], parent }
    node.children = n.children.map(c => clone(c, depth + 1, node))
    return node
}

const imgSize = (n: LayoutNode) => (n.children.length ? 40 : 48)
const isAncestral = (n: LayoutNode) => n.children.length > 0
const isTip = (n: LayoutNode) => n.children.length === 0

const tree = clone(root, 0)
let leaf = 0
const assignRail = (n: LayoutNode): number => {
    if (isTip(n)) {
        n.railY = leaf++ * BAND
        return n.railY
    }
    const ys = n.children.map(assignRail)
    n.railY = (Math.min(...ys) + Math.max(...ys)) / 2
    return n.railY
}
assignRail(tree)

const all: LayoutNode[] = []
const collect = (n: LayoutNode) => {
    all.push(n)
    for (const c of n.children) collect(c)
}
collect(tree)

const assignX = (n: LayoutNode) => {
    n.x = n.depth * DX
    for (const c of n.children) assignX(c)
}
assignX(tree)

const toTreeNode = (n: LayoutNode): CladogramTreeNode => ({
    id: n.id,
    ...(n.label ? { label: n.label } : {}),
    children: n.children.map(toTreeNode),
})

const images: Record<string, { vectorUrl?: string; attribution?: string | null; uuid?: string } | null> = {}
const nodeUuids: Record<string, string> = {}
const gaps: string[] = []

const byDepthDesc = [...all].sort((a, b) => b.depth - a.depth)

for (const n of byDepthDesc) {
    try {
        if (n.label) {
            const childUuids = n.children.map(c => nodeUuids[c.id]).filter((u): u is string => Boolean(u))
            const resolved =
                childUuids.length >= 2 ?
                    await resolveLabelViaDescendantPhylogeny(client, n.label, childUuids)
                :   await resolveLabelToNode(client, n.label)
            const { nodeUuid, warnings } = resolved
            nodeUuids[n.id] = nodeUuid
            if (warnings.length) console.error(`${n.label}: ${warnings.join("; ")}`)
            const idx = cladeIndexEnv(n.label)
            const opts = {
                ...filters,
                ...(IMAGE_OVERRIDES[n.label] ?? {}),
                ...(idx === undefined ? {} : { clade_index: idx }),
            }
            const pick = await pickImage(client, nodeUuid, opts)
            images[n.id] = pick.image
            if (!pick.image) gaps.push(n.label)
            continue
        }
        if (!isUnlabeledInternalNode(toTreeNode(n))) continue
        const treeNode = toTreeNode(n)
        const subcladeRootIds = collectLabeledSubcladeRootIds(treeNode)
        const subcladeLabels = collectLabeledSubcladeRootLabels(treeNode)
        const descendantUuids: string[] = []
        for (let i = 0; i < subcladeRootIds.length; i++) {
            const cached = nodeUuids[subcladeRootIds[i]!]
            if (cached) {
                descendantUuids.push(cached)
                continue
            }
            const { nodeUuid } = await resolveLabelToNode(client, subcladeLabels[i]!)
            descendantUuids.push(nodeUuid)
        }
        const mrca = await resolveMrcaFromDescendants(client, descendantUuids)
        if (!mrca.mrcaUuid) {
            images[n.id] = null
            continue
        }
        nodeUuids[n.id] = mrca.mrcaUuid
        const pick = await pickImage(client, mrca.mrcaUuid, filters)
        images[n.id] = pick.image
        console.error(`Unlabeled ${n.id} MRCA [${subcladeLabels.join(", ")}] → ${pick.image?.uuid ?? "null"}`)
    } catch (e) {
        images[n.id] = null
        if (n.label) gaps.push(n.label)
        console.error(`Failed ${n.label ?? n.id}: ${e instanceof Error ? e.message : e}`)
    }
}

if (gaps.length) console.error("No image:", gaps.join(", "))

const link = (href: string, inner: string) => `<a href="${href}" xlink:href="${href}">${inner}</a>`

const padX = 32
const maxS = 48
const padY = maxS + LINE_GAP + 8
const offsetY = padY - Math.min(...all.map(n => n.railY!))

const nodeX = (n: LayoutNode) => n.x! + padX
const tipX = (n: LayoutNode) => nodeX(n) + (isTip(n) ? TIP_LEFT_MARGIN : 0)
const nodeSlotRight = (n: LayoutNode) => nodeX(n) + imgSize(n)
const tipSilhouetteRight = (n: LayoutNode) => tipX(n) + imgSize(n)

const lines: string[] = []
for (const n of all) {
    if (!isAncestral(n) || n.parent) continue
    const y = n.railY! + offsetY
    lines.push(`<line x1="${nodeX(n)}" y1="${y}" x2="${nodeSlotRight(n)}" y2="${y}" stroke="#333" stroke-width="1.5"/>`)
}

const drawEdges = (n: LayoutNode) => {
    const y1 = n.railY! + offsetY
    const xOut = nodeSlotRight(n)
    for (const c of n.children) {
        const y2 = c.railY! + offsetY
        const mid = xOut + H_STUB
        const pts: string[] = [`${xOut},${y1}`, `${mid},${y1}`, `${mid},${y2}`]
        if (isAncestral(c)) {
            pts.push(`${nodeX(c)},${y2}`, `${nodeSlotRight(c)},${y2}`)
        } else if (images[c.id]?.vectorUrl) {
            pts.push(`${tipSilhouetteRight(c)},${y2}`)
        } else {
            pts.push(`${nodeX(c)},${y2}`)
        }
        lines.push(`<polyline fill="none" stroke="#333" stroke-width="1.5" points="${pts.join(" ")}"/>`)
        drawEdges(c)
    }
}
drawEdges(tree)

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const nodesSvg = all
    .filter(n => n.label || (isUnlabeledInternalNode(toTreeNode(n)) && images[n.id]?.vectorUrl))
    .map(n => {
        const s = imgSize(n)
        const x = isTip(n) ? tipX(n) : nodeX(n)
        const rail = n.railY! + offsetY
        const img = images[n.id]
        const nodeUuid = nodeUuids[n.id]
        let g = `<g id="${n.id}">`
        if (img?.vectorUrl && img.uuid) {
            const imageMarkup = `<image href="${img.vectorUrl}" x="${x}" y="${rail - LINE_GAP - s}" width="${s}" height="${s}"/>`
            g += link(phylopicImagePageUrl(img.uuid), imageMarkup)
        }
        if (n.label) {
            const label = esc(n.label)
            const textY = isTip(n) && !img?.vectorUrl ? rail : rail + LABEL_OFFSET
            const font = labelFontAttrs(n.label)
            const textInner =
                isTip(n) && !img?.vectorUrl ?
                    `<text x="${x}" y="${textY}" dominant-baseline="middle" ${font}>${label}</text>`
                :   `<text x="${x}" y="${textY}" ${font}>${label}</text>`
            if (nodeUuid) g += link(phylopicNodePageUrl(nodeUuid), textInner)
            else g += textInner
        }
        return `${g}</g>`
    })
    .join("\n")

const boundsTop = Math.min(
    ...all.flatMap(n => {
        const rail = n.railY! + offsetY
        const s = imgSize(n)
        if (images[n.id]?.vectorUrl) return [rail - LINE_GAP - s]
        if (isTip(n) && !images[n.id]?.vectorUrl && n.label) return [rail - 10]
        return [rail]
    }),
)
const boundsBottom = Math.max(
    ...all.map(n => {
        const rail = n.railY! + offsetY
        if (isTip(n) && !images[n.id]?.vectorUrl) return rail + 10
        return rail + LABEL_OFFSET + 4
    }),
)
const boundsRight =
    Math.max(
        ...all.map(n => {
            const x = tipX(n)
            const len = (n.label?.length ?? 0) * 6.5
            const right =
                isTip(n) && images[n.id]?.vectorUrl ? tipSilhouetteRight(n) : Math.max(nodeSlotRight(n), x + len)
            return Math.max(right + H_STUB, x + len)
        }),
    ) + padX

const shift = boundsTop - 8
const shiftY = (y: number) => y - shift
const h = boundsBottom - boundsTop + padY
const w = boundsRight

const shiftedLines = lines.map(l =>
    l.includes("<line") ?
        l
            .replace(/\by1="([\d.]+)"/g, (_, y) => `y1="${shiftY(Number(y))}"`)
            .replace(/\by2="([\d.]+)"/g, (_, y) => `y2="${shiftY(Number(y))}"`)
    :   l.replace(/points="([^"]+)"/g, (_, pts) =>
            `points="${pts
                .split(" ")
                .map(p => {
                    const [a, b] = p.split(",")
                    return `${a},${shiftY(Number(b))}`
                })
                .join(" ")}"`,
        ),
)
const shiftedNodes = nodesSvg.replace(/\by="([\d.]+)"/g, (_, y) => `y="${shiftY(Number(y))}"`)

const attributions = all
    .filter(n => n.label && images[n.id]?.attribution)
    .map(n => `${n.label}: ${images[n.id]!.attribution}`)
    .join("; ")

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>${esc(rootLabel)} cladogram</title>
  <desc>Illustrated cladogram from Newick. NonCommercial licenses excluded.${gaps.length ? ` No image: ${gaps.join(", ")}.` : ""}${attributions ? ` Attribution: ${attributions}` : ""}</desc>
  <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>
  ${shiftedLines.join("\n  ")}
  ${shiftedNodes}
</svg>`

const out = join(homedir(), "Desktop", outputName)
writeFileSync(out, svg)
console.error(`Wrote ${out} (${all.filter(n => n.label).length} labeled nodes, ${all.filter(n => isTip(n)).length} tips)`)
