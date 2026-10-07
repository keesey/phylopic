/**
 * Radial cladogram geometry (paths, legend, colors) for MCP agents and SVG renderers.
 */

import {
    assignRadialCladogramLayout,
    DEFAULT_RADIAL_CLADOGRAM_THEME,
    meanAngleRad,
    polarToCartesian,
    radialAncestralArcPath,
    radialBranchEdgePath,
    radialBranchTipRadiusForLabels,
    radialInnerRingLabelRadius,
    radialInnerRingLabelTextPlacement,
    radialInnerRingSilhouetteRotationDeg,
    radialLabelPoint,
    radialLabelTextPlacement,
    radialLegendRingRadius,
    radialMaxTipLabelWidth,
    radialOuterLayoutViewBoxHalfExtent,
    radialRadiusScaleFromLayout,
    radialSilhouetteRotationDeg,
    RADIAL_CLADE_KEY_TIP_THRESHOLD,
    type RadialLayoutNode,
    type RadialLayoutResult,
    type RadialRadiusMode,
    type RadialRadiusScale,
    type RadialCladogramTheme,
} from "./radialCladogramLayout.js"
import { DEFAULT_SVG_LABEL_FONT, type SvgLabelFont } from "./newickLabelStyle.js"
import { selectRadialLegendClades } from "./selectRadialLegendClades.js"
import { assignTolColorsByAngle, type TolColorScheme } from "./tolColorSchemes.js"

export type RadialCladogramTreeInput = Readonly<{
    id: string
    label?: string
    branchLength?: number
    children: readonly RadialCladogramTreeInput[]
}>

type MutableLayoutNode = Omit<RadialLayoutNode, "children"> & {
    id: string
    parent?: MutableLayoutNode
    children: MutableLayoutNode[]
}

export type BuildRadialCladogramLayoutOptions = Readonly<{
    tipCount: number
    radiusMode?: RadialRadiusMode
    /** Outer silhouette ring before label-band inset (labeled-tip mode). */
    outerLayoutRadius?: number
    forceTipLabels?: boolean
    silhouetteOutset?: number
    maxLegendSpanDeg?: number
    tolScheme?: TolColorScheme
    labelFont?: SvgLabelFont
    tipImageSlotSize?: number
    cladeLegendImageSlotSize?: number
    viewBoxTailPad?: number
}>

export type RadialStrokePath = Readonly<{ d: string; stroke: string }>

export type RadialTipLabelPlacement = Readonly<{
    nodeId: string
    label: string
    x: number
    y: number
    rotationDeg: number
    textAnchor: "start" | "end"
}>

export type RadialSilhouettePlacement = Readonly<{
    nodeId: string
    x: number
    y: number
    rotationDeg: number
    slotSize: number
    tintColor?: string
    filterId?: string
}>

export type RadialLegendLabelPlacement = Readonly<{
    cladeId: string
    label: string
    x: number
    y: number
    rotationDeg: number
}>

export type RadialCladogramLayoutGeometry = Readonly<{
    cladeKeyMode: boolean
    showTipLabels: boolean
    layout: RadialLayoutResult
    radiusScale: RadialRadiusScale | undefined
    radialTheme: RadialCladogramTheme
    contentPad: number
    silhouetteRadius: number
    legendCladeIds: readonly string[]
    tipCladeIdByNodeId: Readonly<Record<string, string | undefined>>
    arcs: readonly RadialStrokePath[]
    edges: readonly RadialStrokePath[]
    tipLabels: readonly RadialTipLabelPlacement[]
    tipSilhouettes: readonly RadialSilhouettePlacement[]
    legendSilhouettes: readonly RadialSilhouettePlacement[]
    legendLabels: readonly RadialLegendLabelPlacement[]
    cladeColorByNodeId: Readonly<Record<string, string>>
}>

const cloneWithParent = (n: RadialCladogramTreeInput, parent?: MutableLayoutNode): MutableLayoutNode => {
    const node: MutableLayoutNode = {
        id: n.id,
        label: n.label,
        branchLength: n.branchLength,
        children: [],
        parent,
    }
    node.children = n.children.map(c => cloneWithParent(c, node))
    return node
}

const isTip = (n: MutableLayoutNode) => n.children.length === 0

const tipsUnder = (n: MutableLayoutNode): MutableLayoutNode[] => {
    if (isTip(n)) return [n]
    return n.children.flatMap(c => tipsUnder(c))
}

const isDescendant = (ancestor: MutableLayoutNode, node: MutableLayoutNode): boolean => {
    let p: MutableLayoutNode | undefined = node.parent
    while (p) {
        if (p.id === ancestor.id) return true
        p = p.parent
    }
    return false
}

const defaultOuterRadius = (tipCount: number) => Math.max(420, tipCount * 0.95)

export const buildRadialCladogramLayout = (
    rootInput: RadialCladogramTreeInput,
    options: BuildRadialCladogramLayoutOptions,
): RadialCladogramLayoutGeometry => {
    const tipCount = options.tipCount
    const forceTipLabels = options.forceTipLabels ?? false
    const showTipLabels = forceTipLabels || tipCount <= RADIAL_CLADE_KEY_TIP_THRESHOLD
    const cladeKeyMode = !showTipLabels
    const radiusMode = options.radiusMode ?? "equalDepth"
    const labelFont = options.labelFont ?? DEFAULT_SVG_LABEL_FONT
    const tipSlot = options.tipImageSlotSize ?? 40
    const cladeSlot = options.cladeLegendImageSlotSize ?? 44
    const tailPad = options.viewBoxTailPad ?? 40

    const tree = cloneWithParent(rootInput)
    const all: MutableLayoutNode[] = []
    const collect = (n: MutableLayoutNode) => {
        all.push(n)
        for (const c of n.children) collect(c)
    }
    collect(tree)

    const outerLayoutRadius = options.outerLayoutRadius ?? defaultOuterRadius(tipCount)
    const maxLabelWidth = showTipLabels
        ? radialMaxTipLabelWidth(
              all.filter(n => isTip(n)),
              labelFont,
          )
        : 0
    const themeBase = { ...DEFAULT_RADIAL_CLADOGRAM_THEME }
    const tipRadius = showTipLabels
        ? radialBranchTipRadiusForLabels(outerLayoutRadius, themeBase, maxLabelWidth)
        : outerLayoutRadius
    const silhouetteOutset =
        showTipLabels ?
            outerLayoutRadius - tipRadius
        :   (options.silhouetteOutset ?? 52)
    const radialTheme: RadialCladogramTheme = {
        ...themeBase,
        tipRadius,
        silhouetteOutset,
    }

    const layout = assignRadialCladogramLayout(tree, radialTheme, { radiusMode })
    const { maxDepth } = layout
    const radiusScale = radialRadiusScaleFromLayout(layout)
    const silhouetteRadius = tipRadius + silhouetteOutset

    const legendClades = cladeKeyMode
        ? selectRadialLegendClades(tree, {
              legendRingRadius: radialLegendRingRadius(radialTheme),
              legendSilhouetteWidth: cladeSlot,
              labelFont,
              ...(options.maxLegendSpanDeg !== undefined ?
                  { maxLegendSpanDeg: options.maxLegendSpanDeg }
              :   {}),
              totalTipCount: tipCount,
          })
        : []

    const cladeForTip = (tip: MutableLayoutNode): MutableLayoutNode | undefined => {
        let best: MutableLayoutNode | undefined
        let bestDepth = -1
        for (const clade of legendClades) {
            if (!isDescendant(clade, tip)) continue
            const d = clade.depth ?? 0
            if (d > bestDepth) {
                best = clade
                bestDepth = d
            }
        }
        return best
    }

    const tolScheme = options.tolScheme ?? "darkRainbow"
    const cladeMeanAngleRad = (clade: MutableLayoutNode) =>
        meanAngleRad(tipsUnder(clade).map(t => t.angle ?? 0))
    const cladeColorById = assignTolColorsByAngle(
        legendClades.map(clade => ({ id: clade.id, angleRad: cladeMeanAngleRad(clade) })),
        tolScheme,
    )
    const cladeColor = (clade: MutableLayoutNode) => cladeColorById.get(clade.id) ?? "#888888"

    const tipCladeColor = new Map<string, string>()
    const tipCladeIdByNodeId: Record<string, string | undefined> = {}
    for (const n of all) {
        if (!isTip(n)) continue
        const clade = cladeForTip(n)
        tipCladeIdByNodeId[n.id] = clade?.id
        tipCladeColor.set(n.id, clade ? cladeColor(clade) : "#888")
    }

    const cladeKeyStrokeForSubtree = (n: MutableLayoutNode): string => {
        if (!cladeKeyMode) return "#333"
        const tips = tipsUnder(n)
        const colors = new Set(tips.map(t => tipCladeColor.get(t.id) ?? "#888"))
        if (colors.size === 1) return [...colors][0]!
        return "#bbb"
    }

    const legendCladeIdSet = new Set(legendClades.map(c => c.id))
    const edgeStroke = (_parent: MutableLayoutNode, child: MutableLayoutNode): string => {
        if (legendCladeIdSet.has(child.id)) return "#bbb"
        return cladeKeyStrokeForSubtree(child)
    }

    const arcs: RadialStrokePath[] = []
    const drawArcs = (n: MutableLayoutNode) => {
        const d = radialAncestralArcPath(n, maxDepth, radialTheme, radiusScale)
        if (d) {
            arcs.push({ d, stroke: cladeKeyStrokeForSubtree(n) })
        }
        for (const c of n.children) drawArcs(c)
    }
    drawArcs(tree)

    const edges: RadialStrokePath[] = []
    const drawEdges = (n: MutableLayoutNode) => {
        for (const c of n.children) {
            const d = radialBranchEdgePath(n, c, maxDepth, radialTheme, radiusScale)
            edges.push({ d, stroke: edgeStroke(n, c) })
            drawEdges(c)
        }
    }
    drawEdges(tree)

    const tipLabels: RadialTipLabelPlacement[] = []
    const tipSilhouettes: RadialSilhouettePlacement[] = []
    if (showTipLabels) {
        for (const n of all) {
            if (!isTip(n) || !n.label) continue
            const lp = radialLabelPoint(n, maxDepth, radialTheme, radiusScale)
            const labelPlace = radialLabelTextPlacement(n.angle ?? 0)
            tipLabels.push({
                nodeId: n.id,
                label: n.label,
                x: lp.x,
                y: lp.y,
                rotationDeg: labelPlace.rotationDeg,
                textAnchor: labelPlace.textAnchor,
            })
            const theta = n.angle ?? 0
            const tipR =
                radiusScale !== undefined
                    ? ((n.pathLengthFromRoot ?? 0) / radiusScale.maxRootToTipPathLength) *
                      radialTheme.tipRadius
                    : silhouetteRadius - radialTheme.silhouetteOutset
            const rim = polarToCartesian(tipR + radialTheme.silhouetteOutset, theta)
            tipSilhouettes.push({
                nodeId: n.id,
                x: rim.x,
                y: rim.y,
                rotationDeg: radialSilhouetteRotationDeg(theta),
                slotSize: tipSlot,
            })
        }
    }

    const legendSilhouettes: RadialSilhouettePlacement[] = []
    const legendLabels: RadialLegendLabelPlacement[] = []
    if (cladeKeyMode) {
        for (const clade of legendClades) {
            const tips = tipsUnder(clade)
            const theta = meanAngleRad(tips.map(t => t.angle ?? 0))
            const color = cladeColor(clade)
            const rim = polarToCartesian(silhouetteRadius, theta)
            legendSilhouettes.push({
                nodeId: clade.id,
                x: rim.x,
                y: rim.y,
                rotationDeg: radialInnerRingSilhouetteRotationDeg(theta),
                slotSize: cladeSlot,
                tintColor: color,
                filterId: `clade-${clade.id}`,
            })
            if (clade.label) {
                const labelR = radialInnerRingLabelRadius(radialTheme)
                const lp = polarToCartesian(labelR, theta)
                const cladeLabel = radialInnerRingLabelTextPlacement(theta)
                legendLabels.push({
                    cladeId: clade.id,
                    label: clade.label,
                    x: lp.x,
                    y: lp.y,
                    rotationDeg: cladeLabel.rotationDeg,
                })
            }
        }
    }

    const contentPad = showTipLabels
        ? radialOuterLayoutViewBoxHalfExtent(outerLayoutRadius, tipSlot, tailPad)
        : silhouetteRadius + cladeSlot + tailPad

    const cladeColorByNodeId: Record<string, string> = {}
    for (const [id, color] of cladeColorById) {
        cladeColorByNodeId[id] = color
    }

    return {
        cladeKeyMode,
        showTipLabels,
        layout,
        radiusScale,
        radialTheme,
        contentPad,
        silhouetteRadius,
        legendCladeIds: legendClades.map(c => c.id),
        tipCladeIdByNodeId,
        arcs,
        edges,
        tipLabels,
        tipSilhouettes,
        legendSilhouettes,
        legendLabels,
        cladeColorByNodeId,
    }
}
