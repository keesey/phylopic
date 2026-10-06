import type { ImageWithEmbedded } from "@phylopic/api-models"
import {
    assignBasicCladogramColumnsFromTree,
    assignBasicCladogramRails,
    contentBottomY,
    DEFAULT_BASIC_CLADOGRAM_THEME,
    silhouetteTopY,
    verticalGutterOffset,
    type BasicNodeMeasures,
} from "./basicCladogramLayout.js"
import type { CollectionCladogramTree } from "./types.js"
import { buildCollectionDiagramFooter } from "./diagramFooter.js"
import { measureLabel } from "./measureLabel.js"
import { DEFAULT_SVG_LABEL_FONT, isVernacularNewickLabel } from "./newickLabelStyle.js"
import { phylopicImagePageUrl, phylopicNodePageUrl } from "./phylopicUrls.js"
import {
    bottomAlignArtInSquareSlot,
    fetchSvgViewBoxSize,
    silhouetteSquareSlot,
    type ViewBoxSize,
} from "./silhouetteViewBox.js"

const TIP_IMG = 48
const FONT = DEFAULT_SVG_LABEL_FONT

type LayoutNode = {
    id: string
    label?: string
    depth: number
    children: LayoutNode[]
    railY?: number
    x?: number
}

export type RenderCollectionCladogramInput = Readonly<{
    built: CollectionCladogramTree
    imagesByUuid: ReadonlyMap<string, ImageWithEmbedded>
    wwwOrigin: string
    collectionPageUrl: string
    diagramTitle?: string
    fetch?: typeof fetch
}>

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

const cloneTree = (n: CollectionCladogramTree["tree"]["root"], depth: number): LayoutNode => ({
    id: n.id,
    label: n.label,
    depth,
    children: n.children.map(c => cloneTree(c, depth + 1)),
})

export const renderCollectionCladogramSvg = async ({
    built,
    imagesByUuid,
    wwwOrigin,
    collectionPageUrl,
    diagramTitle = "Collection cladogram",
    fetch: fetchFn = fetch,
}: RenderCollectionCladogramInput): Promise<string> => {
    const theme = DEFAULT_BASIC_CLADOGRAM_THEME
    const tree = cloneTree(built.tree.root, 0)
    const all: LayoutNode[] = []
    const collect = (n: LayoutNode) => {
        all.push(n)
        for (const c of n.children) collect(c)
    }
    collect(tree)

    /** Collection silhouettes on tips only; ancestral nodes are label-only. */
    const tipImage = (n: LayoutNode) => {
        if (n.children.length > 0) {
            return null
        }
        const imageUuid = built.imageUuidByTreeId[n.id]
        if (!imageUuid) return null
        const image = imagesByUuid.get(imageUuid)
        const vectorUrl = image?._links?.vectorFile?.href
        if (!vectorUrl) return null
        return { uuid: imageUuid, vectorUrl }
    }

    const artViewBox: Record<string, ViewBoxSize> = {}
    for (const n of all) {
        const img = tipImage(n)
        if (!img) continue
        const vb = await fetchSvgViewBoxSize(img.vectorUrl, fetchFn)
        if (vb) artViewBox[n.id] = vb
    }

    const nodeMeasures = (n: LayoutNode): BasicNodeMeasures => {
        const isTip = n.children.length === 0
        const img = tipImage(n)
        const hasImage = Boolean(img)
        const slot = hasImage ? silhouetteSquareSlot(TIP_IMG) : null
        const hasLabel = Boolean(n.label)
        const lb = hasLabel && n.label ? measureLabel(n.label, FONT) : { width: 0, height: 0 }
        return {
            hasImage,
            imageWidth: slot?.width ?? 0,
            imageHeight: slot?.height ?? 0,
            hasLabel,
            labelWidth: lb.width,
            labelHeight: lb.height,
            isTip,
        }
    }

    assignBasicCladogramRails(tree, nodeMeasures, theme)
    assignBasicCladogramColumnsFromTree(tree, nodeMeasures, theme)

    const padX = 24
    const padY = 16
    const offsetY = padY + TIP_IMG + theme.lineGap - Math.min(...all.map(n => n.railY!))

    const isTip = (n: LayoutNode) => n.children.length === 0
    const isAncestral = (n: LayoutNode) => n.children.length > 0
    const nodeX = (n: LayoutNode) => n.x! + padX
    const contentX = (n: LayoutNode) => nodeX(n) + theme.tipContentInset
    const labelX = (n: LayoutNode) => (isTip(n) ? contentX(n) : nodeX(n))
    const imgRight = (n: LayoutNode) => contentX(n) + nodeMeasures(n).imageWidth
    const gutterX = (n: LayoutNode) => nodeX(n) + verticalGutterOffset(nodeMeasures(n), theme)
    const railExitX = (n: LayoutNode) => {
        const m = nodeMeasures(n)
        return m.hasImage ? imgRight(n) : nodeX(n)
    }

    const lines: string[] = []
    for (const n of all) {
        if (!isAncestral(n) || n.depth !== 0) continue
        const y = n.railY! + offsetY
        lines.push(`<line x1="${nodeX(n)}" y1="${y}" x2="${railExitX(n)}" y2="${y}" stroke="#333" stroke-width="1.5"/>`)
    }

    const drawEdges = (n: LayoutNode) => {
        const y1 = n.railY! + offsetY
        const xOut = railExitX(n)
        const mid = gutterX(n)
        for (const c of n.children) {
            const y2 = c.railY! + offsetY
            const pts: string[] = [`${xOut},${y1}`, `${mid},${y1}`, `${mid},${y2}`]
            if (isAncestral(c)) {
                pts.push(`${nodeX(c)},${y2}`, `${railExitX(c)},${y2}`)
            } else if (tipImage(c)) {
                pts.push(`${imgRight(c)},${y2}`)
            } else {
                pts.push(`${nodeX(c)},${y2}`)
            }
            lines.push(`<polyline fill="none" stroke="#333" stroke-width="1.5" points="${pts.join(" ")}"/>`)
            drawEdges(c)
        }
    }
    drawEdges(tree)

    const link = (href: string, inner: string) => `<a href="${href}" xlink:href="${href}">${inner}</a>`
    const labelFontAttrs = (label: string) => {
        const base = `font-family="${FONT.family}" font-size="${FONT.size}"`
        return isVernacularNewickLabel(label) ? base : `${base} font-style="italic"`
    }

    const nodesSvg = all
        .filter(n => Boolean(n.label))
        .map(n => {
            const m = nodeMeasures(n)
            const rail = n.railY! + offsetY
            const x = labelX(n)
            const img = tipImage(n)
            const nodeUuid = built.nodeUuidByTreeId[n.id]
            let g = `<g id="${n.id}">`
            if (img) {
                const slotY = silhouetteTopY(rail, m, theme)
                const slotSize = m.imageWidth
                const imageX = contentX(n)
                const vb = artViewBox[n.id] ?? { width: slotSize, height: slotSize }
                const p = bottomAlignArtInSquareSlot(slotSize, vb)
                g += link(
                    phylopicImagePageUrl(wwwOrigin, img.uuid),
                    `<image href="${esc(img.vectorUrl)}" x="${imageX + p.x}" y="${slotY + p.y}" width="${p.width}" height="${p.height}"/>`,
                )
            }
            if (n.label) {
                const label = esc(n.label)
                const font = labelFontAttrs(n.label)
                const textY =
                    isTip(n) && !img ? rail : rail + theme.labelGap + m.labelHeight * 0.85
                const textInner =
                    isTip(n) && !img ?
                        `<text x="${x}" y="${textY}" dominant-baseline="middle" ${font}>${label}</text>`
                    :   `<text x="${x}" y="${textY}" ${font}>${label}</text>`
                g +=
                    nodeUuid ?
                        link(phylopicNodePageUrl(wwwOrigin, nodeUuid), textInner)
                    :   textInner
            }
            return `${g}</g>`
        })
        .join("\n")

    const boundsTop = Math.min(
        ...all.flatMap(n => {
            const rail = n.railY! + offsetY
            const m = nodeMeasures(n)
            if (m.hasImage) return [silhouetteTopY(rail, m, theme)]
            if (m.hasLabel && m.isTip && !m.hasImage) return [rail - m.labelHeight / 2]
            return [rail]
        }),
    )
    const boundsBottom = Math.max(...all.map(n => contentBottomY(n.railY! + offsetY, nodeMeasures(n), theme)))
    const boundsRight =
        Math.max(
            ...all.map(n => {
                const lx = labelX(n)
                const m = nodeMeasures(n)
                return Math.max(m.hasImage ? imgRight(n) : 0, m.hasLabel ? lx + m.labelWidth : 0, gutterX(n))
            }),
        ) + padX

    const shift = boundsTop - 8
    const shiftY = (y: number) => y - shift
    let w = boundsRight
    const h = boundsBottom - boundsTop + padY + 8

    const shiftedLines = lines.map(l =>
        l.includes("<line") ?
            l
                .replace(/\by1="([\d.]+)"/g, (_, y) => `y1="${shiftY(Number(y))}"`)
                .replace(/\by2="([\d.]+)"/g, (_, y) => `y2="${shiftY(Number(y))}"`)
        :   l.replace(/points="([^"]+)"/g, (_, pts) =>
                `points="${pts
                    .split(" ")
                    .map((p: string) => {
                        const [a, b] = p.split(",")
                        return `${a},${shiftY(Number(b))}`
                    })
                    .join(" ")}"`,
            ),
    )
    const shiftedNodes = nodesSvg.replace(/\by="([\d.]+)"/g, (_, y) => `y="${shiftY(Number(y))}"`)

    const usedUuidSet = new Set(Object.values(built.imageUuidByTreeId))
    const usedImages = [...imagesByUuid.values()].filter(img => usedUuidSet.has(String(img.uuid)))
    const publication = buildCollectionDiagramFooter({
        images: usedImages,
        collectionPageUrl,
        diagramTitle,
    })
    w = Math.max(w, 640)
    const footerY = h + 16
    const publicationBlock = publication.footerSvgFragment.replace(
        '<g id="phylopic-diagram-footer">',
        `<g id="phylopic-diagram-footer" transform="translate(${padX}, ${footerY})">`,
    )
    const hTotal = h + 16 + publication.footerBlockHeight + padY

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${hTotal}" width="${w}" height="${hTotal}">
  <title>${esc(diagramTitle)}</title>
  <desc>${esc(publication.descText)}</desc>
  ${publication.metadataXml}
  <rect x="0" y="0" width="${w}" height="${hTotal}" fill="#ffffff"/>
  ${shiftedLines.join("\n  ")}
  ${shiftedNodes}
  ${publicationBlock}
</svg>`
}
