/**
 * One-off experiment renderer (not part of MCP build). Writes ~/Desktop/hominidae-cladogram.svg
 * Set HOMINIDAE_CLADE_INDEX to try alternates (see find_images on Hominidae).
 */
import { writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { parseNewickToTree } from "../src/cladogram/parseNewick.js"
import { pickImage } from "../src/cladogram/pickImage.js"
import { resolveLabelToNode } from "../src/cladogram/resolveLabelToNode.js"
import { PhyloPicClient } from "../src/client/PhyloPicClient.js"
import { phylopicImagePageUrl, phylopicNodePageUrl } from "../src/cladogram/phylopicWebUrls.js"
import type { PickImageOptions } from "../src/cladogram/types.js"

const NEWICK =
    "((Pongo abelii,Pongo tapanuliensis,Pongo pygmaeus)Pongo,((Gorilla gorilla,Gorilla beringei)Gorilla,(Homo sapiens,(Pan troglodytes,Pan paniscus)Pan))Homininae)Hominidae"

const hominidaeIndex = Number(process.env.HOMINIDAE_CLADE_INDEX ?? "1")
const IMAGE_OVERRIDES: Record<string, PickImageOptions> = {
    Hominidae: { filter_license_nc: "false", clade_index: hominidaeIndex },
}

const DX = 90
const BAND = 82
const LINE_GAP = 4
const LABEL_OFFSET = 16
const TIP_LEFT_MARGIN = 8
const FONT = 'font-family="Georgia, serif" font-size="13" font-style="italic"'
const H_STUB = 28
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

const imgSize = (n: LayoutNode) => (n.children.length ? 44 : 52)
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

/** Flip rails so the first tip in parse order is at the bottom (SVG y increases downward). */
const maxRail = Math.max(...all.map(n => n.railY!))
for (const n of all) {
    n.railY = maxRail - n.railY!
}

const assignX = (n: LayoutNode) => {
    n.x = n.depth * DX
    for (const c of n.children) assignX(c)
}
assignX(tree)

const images: Record<string, { vectorUrl?: string; attribution?: string | null; uuid?: string } | null> = {}
const nodeUuids: Record<string, string> = {}
for (const n of all) {
    if (!n.label) continue
    try {
        const { nodeUuid } = await resolveLabelToNode(client, n.label)
        nodeUuids[n.id] = nodeUuid
        const opts = { ...filters, ...(IMAGE_OVERRIDES[n.label] ?? {}) }
        const pick = await pickImage(client, nodeUuid, opts)
        images[n.id] = pick.image
        if (n.label === "Hominidae") {
            console.error(`Hominidae clade_index=${hominidaeIndex} → ${pick.image?.uuid ?? "null"}`)
        }
    } catch {
        images[n.id] = null
    }
}

const link = (href: string, inner: string) =>
    `<a href="${href}" xlink:href="${href}">${inner}</a>`

const padX = 36
const maxS = 52
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
    .filter(n => n.label)
    .map(n => {
        const s = imgSize(n)
        const x = tipX(n)
        const rail = n.railY! + offsetY
        const img = images[n.id]
        const label = esc(n.label!)
        const nodeUuid = nodeUuids[n.id]
        let g = `<g id="${n.id}">`
        if (img?.vectorUrl && img.uuid) {
            const imageMarkup = `<image href="${img.vectorUrl}" x="${x}" y="${rail - LINE_GAP - s}" width="${s}" height="${s}"/>`
            g += link(phylopicImagePageUrl(img.uuid), imageMarkup)
        }
        const textY = isTip(n) && !img?.vectorUrl ? rail : rail + LABEL_OFFSET
        const textInner =
            isTip(n) && !img?.vectorUrl ?
                `<text x="${x}" y="${textY}" dominant-baseline="middle" ${FONT}>${label}</text>`
            :   `<text x="${x}" y="${textY}" ${FONT}>${label}</text>`
        if (nodeUuid) {
            g += link(phylopicNodePageUrl(nodeUuid), textInner)
        } else {
            g += textInner
        }
        return `${g}</g>`
    })
    .join("\n")

const boundsTop = Math.min(
    ...all.flatMap(n => {
        const rail = n.railY! + offsetY
        const s = imgSize(n)
        if (images[n.id]?.vectorUrl) return [rail - LINE_GAP - s]
        if (isTip(n) && !images[n.id]?.vectorUrl) return [rail - 10]
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
            const len = (n.label?.length ?? 0) * 7
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
    .filter(n => images[n.id]?.attribution)
    .map(n => `${n.label}: ${images[n.id]!.attribution}`)
    .join("; ")

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>Hominidae cladogram</title>
  <desc>Illustrated cladogram from Newick. NonCommercial licenses excluded. Hominidae clade_index ${hominidaeIndex}.${attributions ? ` Attribution: ${attributions}` : ""}</desc>
  <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>
  ${shiftedLines.join("\n  ")}
  ${shiftedNodes}
</svg>`

const out = join(homedir(), "Desktop", "hominidae-cladogram.svg")
writeFileSync(out, svg)
console.error(`Wrote ${out}`)
