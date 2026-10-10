import {
    buildRadialCladogramLayout,
    type BuildRadialCladogramLayoutOptions,
    type RadialCladogramTreeInput,
} from "./buildRadialCladogramLayout.js"
import { radialSilhouetteOutwardOffset } from "./radialCladogramLayout.js"
import { bottomAlignArtInSquareSlot } from "./silhouetteViewBox.js"
import { svgLabelFontAttrs, type SvgLabelFont } from "./newickLabelStyle.js"
import { phylopicImagePageUrl, phylopicNodePageUrl } from "./phylopicUrls.js"
import { fetchSvgViewBoxSize, type ViewBoxSize } from "./silhouetteViewBox.js"
import { svgAlphaTintFilterDef, svgAlphaTintFilterRef, svgFilterId } from "./svgAlphaTintFilter.js"

export const DEFAULT_RADIAL_CLADOGRAM_WWW_ORIGIN = "https://www.phylopic.org"

export type RadialNodeArt = Readonly<{
    vectorUrl?: string
    imageUuid?: string
    nodeUuid?: string
}>

export type RadialCladogramPublication = Readonly<{
    descText: string
    metadataXml: string
    footerSvgFragment: string
    footerBlockHeight: number
    viewBoxWidth?: number
}>

export type RenderRadialCladogramSvgInput = Readonly<{
    root: RadialCladogramTreeInput
    tipCount: number
    diagramTitle: string
    layoutOptions?: BuildRadialCladogramLayoutOptions
    nodeArtById?: Readonly<Record<string, RadialNodeArt | null | undefined>>
    publication?: RadialCladogramPublication
    wwwOrigin?: string
    labelFont?: SvgLabelFont
    fetch?: typeof fetch
}>

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

const link = (href: string, inner: string) => `<a href="${href}" xlink:href="${href}">${inner}</a>`

export const renderRadialCladogramSvg = async ({
    root,
    tipCount,
    diagramTitle,
    layoutOptions,
    nodeArtById = {},
    publication,
    wwwOrigin = DEFAULT_RADIAL_CLADOGRAM_WWW_ORIGIN,
    labelFont,
    fetch: fetchFn = fetch,
}: RenderRadialCladogramSvgInput): Promise<string> => {
    const font = labelFont ?? { family: "Georgia, serif", size: 11, italic: true }
    const geometry = buildRadialCladogramLayout(root, {
        tipCount,
        labelFont: font,
        ...layoutOptions,
    })
    const { contentPad: cx } = geometry
    const cy = cx
    const branchTransform = `transform="translate(${cx},${cy})"`
    const toSvg = (x: number, y: number) => ({ x: x + cx, y: y + cy })

    const artViewBox: Record<string, ViewBoxSize> = {}
    for (const [id, art] of Object.entries(nodeArtById)) {
        const url = art?.vectorUrl
        if (!url) continue
        const vb = await fetchSvgViewBoxSize(url, fetchFn)
        if (vb) artViewBox[id] = vb
    }

    const labelFontAttrs = (label: string) => {
        const attrs = svgLabelFontAttrs(label, font)
        const parts = [
            `font-family="${esc(attrs.fontFamily)}"`,
            `font-size="${attrs.fontSize}"`,
            attrs.fontStyle ? `font-style="${attrs.fontStyle}"` : "",
        ].filter(Boolean)
        return parts.join(" ")
    }

    const arcPaths = geometry.arcs.map(
        a => `<path d="${a.d}" fill="none" stroke="${a.stroke}" stroke-width="1.25" ${branchTransform}/>`,
    )
    const edgePaths = geometry.edges.map(
        e => `<path d="${e.d}" fill="none" stroke="${e.stroke}" stroke-width="1.25" ${branchTransform}/>`,
    )

    const svgFilterDefs: string[] = []
    const nodeGroups: string[] = []

    for (const tip of geometry.tipSilhouettes) {
        const art = nodeArtById[tip.nodeId]
        if (art?.vectorUrl && art.imageUuid) {
            const vb = artViewBox[tip.nodeId] ?? { width: tip.slotSize, height: tip.slotSize }
            const p = bottomAlignArtInSquareSlot(tip.slotSize, vb)
            const outward = radialSilhouetteOutwardOffset(tip.bearingRad, p.height)
            const sp = toSvg(tip.x + outward.dx, tip.y + outward.dy)
            let g = `<g id="${tip.nodeId}" transform="translate(${sp.x},${sp.y}) rotate(${tip.rotationDeg})">`
            g += link(
                phylopicImagePageUrl(wwwOrigin, art.imageUuid),
                `<image href="${art.vectorUrl}" x="${-tip.slotSize / 2 + p.x}" y="${-tip.slotSize + p.y}" width="${p.width}" height="${p.height}"/>`,
            )
            g += `</g>`
            nodeGroups.push(g)
        }
    }

    for (const tip of geometry.tipLabels) {
        const sp = toSvg(tip.x, tip.y)
        const art = nodeArtById[tip.nodeId]
        const labelInner = `<text text-anchor="${tip.textAnchor}" dominant-baseline="middle" x="0" y="0" ${labelFontAttrs(tip.label)}>${esc(tip.label)}</text>`
        nodeGroups.push(
            `<g transform="translate(${sp.x},${sp.y}) rotate(${tip.rotationDeg})">${art?.nodeUuid ? link(phylopicNodePageUrl(wwwOrigin, art.nodeUuid), labelInner) : labelInner}</g>`,
        )
    }

    for (const leg of geometry.legendSilhouettes) {
        const art = nodeArtById[leg.nodeId]
        if (art?.vectorUrl && art.imageUuid && leg.tintColor) {
            const filterId = svgFilterId(leg.filterId ?? leg.nodeId)
            svgFilterDefs.push(svgAlphaTintFilterDef(filterId, leg.tintColor))
            const vb = artViewBox[leg.nodeId] ?? { width: leg.slotSize, height: leg.slotSize }
            const p = bottomAlignArtInSquareSlot(leg.slotSize, vb)
            const outward = radialSilhouetteOutwardOffset(leg.bearingRad, p.height)
            const sp = toSvg(leg.x + outward.dx, leg.y + outward.dy)
            let g = `<g id="clade-${leg.nodeId}" transform="translate(${sp.x},${sp.y}) rotate(${leg.rotationDeg})">`
            g += link(
                phylopicImagePageUrl(wwwOrigin, art.imageUuid),
                `<image href="${art.vectorUrl}" x="${-leg.slotSize / 2 + p.x}" y="${-leg.slotSize + p.y}" width="${p.width}" height="${p.height}" filter="${svgAlphaTintFilterRef(filterId)}"/>`,
            )
            g += `</g>`
            nodeGroups.push(g)
        }
    }

    for (const leg of geometry.legendLabels) {
        const lsp = toSvg(leg.x, leg.y)
        const art = nodeArtById[leg.cladeId]
        const labelInner = `<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" ${labelFontAttrs(leg.label)} fill="#000000">${esc(leg.label)}</text>`
        nodeGroups.push(
            `<g transform="translate(${lsp.x},${lsp.y}) rotate(${leg.rotationDeg})">${art?.nodeUuid ? link(phylopicNodePageUrl(wwwOrigin, art.nodeUuid), labelInner) : labelInner}</g>`,
        )
    }

    let w = Math.ceil(cx * 2)
    let h = w
    const FOOTER_TOP_GAP = 16
    let publicationBlock = ""
    let descText = `Radial cladogram (${tipCount} tips).`
    let metadataXml = ""
    let footerHeight = 0

    if (publication) {
        descText = publication.descText
        metadataXml = publication.metadataXml
        footerHeight = publication.footerBlockHeight
        if (publication.viewBoxWidth && publication.viewBoxWidth > w) {
            w = publication.viewBoxWidth
        }
        const footerY = h + FOOTER_TOP_GAP
        publicationBlock = publication.footerSvgFragment.replace(
            '<g id="phylopic-diagram-footer">',
            `<g id="phylopic-diagram-footer" transform="translate(24, ${footerY})">`,
        )
    }

    const hTotal = h + (footerHeight > 0 ? FOOTER_TOP_GAP + footerHeight + 24 : 0)

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${hTotal}" width="${w}" height="${hTotal}">
  <title>${esc(diagramTitle)}</title>
  <desc>${esc(descText)}</desc>
  ${metadataXml}
  ${svgFilterDefs.length > 0 ? `<defs>\n    ${svgFilterDefs.join("\n    ")}\n  </defs>` : ""}
  <rect x="0" y="0" width="${w}" height="${hTotal}" fill="#ffffff"/>
  ${arcPaths.join("\n  ")}
  ${edgePaths.join("\n  ")}
  ${nodeGroups.join("\n  ")}
  ${publicationBlock}
</svg>`
}
