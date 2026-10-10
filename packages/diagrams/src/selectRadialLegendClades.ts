/**
 * Pick named internal nodes to label on radial clade-key figures (rim silhouettes + inner ring).
 */

import { measureLabel } from "./measureLabel.js"
import { DEFAULT_SVG_LABEL_FONT, type SvgLabelFont } from "./newickLabelStyle.js"
import { radialDescendantAngleSpanRad, type RadialLayoutNode } from "./radialCladogramLayout.js"

export type RadialLegendTreeNode = Readonly<{
    label?: string
    children: readonly RadialLegendTreeNode[]
}>

export type SelectRadialLegendCladesOptions = Readonly<{
    /**
     * Radius (px) of the legend ring used to convert minimum slot width → radians
     * ({@link radialLegendRingRadius} = tipRadius + silhouetteOutset).
     */
    legendRingRadius: number
    /** Silhouette slot width in px. Default {@link DEFAULT_RADIAL_LEGEND_SILHOUETTE_WIDTH}. */
    legendSilhouetteWidth?: number
    /** Font for {@link maxInternalCladeLabelWidth} when passing {@link longestLegendLabelWidth} manually. */
    labelFont?: SvgLabelFont
    /**
     * When set, minimum slot width is max({@link legendSilhouetteWidth}, this value) instead of
     * silhouette width alone (legacy label-aware floor).
     */
    longestLegendLabelWidth?: number
    /** Override minimum angular span (radians); default from slot width ÷ ring radius. */
    minLegendSpanRad?: number
    /** Maximum angular span (radians) for one legend clade. Default {@link DEFAULT_RADIAL_LEGEND_MAX_CLADE_SPAN_DEG}. */
    maxLegendSpanRad?: number
    /** Same as {@link maxLegendSpanRad}, in degrees (overrides rad when both set). */
    maxLegendSpanDeg?: number
    /** Skip shallow internals (default 2 — not immediate children of the root). */
    minDepth?: number
    /** Total tip count; computed from the root when omitted. */
    totalTipCount?: number
}>

export const DEFAULT_RADIAL_LEGEND_SILHOUETTE_WIDTH = 44
/** Widest wedge (degrees) a labeled clade may occupy and still appear on the rim. */
export const DEFAULT_RADIAL_LEGEND_MAX_CLADE_SPAN_DEG = 45
export const DEFAULT_RADIAL_LEGEND_MIN_DEPTH = 2

export const radialLegendSpanRadFromDegrees = (degrees: number): number => (degrees * Math.PI) / 180

/** Central angle (radians) for an arc of length `arcLengthPx` on a circle of radius `radiusPx`. */
export const radialLegendMinSpanRadFromSlotWidth = (
    slotWidthPx: number,
    legendRingRadiusPx: number,
): number => (legendRingRadiusPx > 0 ? slotWidthPx / legendRingRadiusPx : 0)

/** Rim slot width when combining silhouette size with an explicit label width (legacy floor). */
export const radialLegendMinSlotWidthPx = (
    silhouetteWidthPx: number,
    longestLabelWidthPx: number,
): number => Math.max(silhouetteWidthPx, longestLabelWidthPx)

const isTip = (n: RadialLegendTreeNode): boolean => n.children.length === 0

/** Descendant tip count (includes `n` when `n` is a tip). */
export const countTipsUnderLegendNode = (n: RadialLegendTreeNode): number => {
    if (isTip(n)) return 1
    return n.children.reduce((sum, c) => sum + countTipsUnderLegendNode(c), 0)
}

/** Widest clade label among labeled internal nodes (e.g. for {@link longestLegendLabelWidth}). */
export const maxInternalCladeLabelWidth = (
    root: RadialLegendTreeNode,
    font: SvgLabelFont = DEFAULT_SVG_LABEL_FONT,
): number => {
    let max = 0
    const visit = (n: RadialLegendTreeNode) => {
        if (!isTip(n) && n.label) {
            max = Math.max(max, measureLabel(n.label, font).width)
        }
        for (const c of n.children) visit(c)
    }
    visit(root)
    return max
}

type MutableLegendNode = {
    label?: string
    children: MutableLegendNode[]
}

const buildParentMap = <T extends MutableLegendNode>(root: T): Map<T, T | undefined> => {
    const parent = new Map<T, T | undefined>()
    const walk = (n: T, p: T | undefined) => {
        parent.set(n, p)
        for (const c of n.children as T[]) walk(c, n)
    }
    walk(root, undefined)
    return parent
}

const isDescendantOf = <T>(ancestor: T, node: T, parentMap: Map<T, T | undefined>): boolean => {
    let p = parentMap.get(node)
    while (p) {
        if (p === ancestor) return true
        p = parentMap.get(p)
    }
    return false
}

/**
 * Greedy selection of **major** labeled clades for radial clade-key mode.
 *
 * Call after {@link assignRadialCladogramLayout} so each node has bearings. A clade qualifies when
 * its descendant tips span at least the angular width of one rim silhouette slot—default slot width
 * is {@link legendSilhouetteWidth} converted to radians at
 * {@link SelectRadialLegendCladesOptions.legendRingRadius}. Prefer **deeper** clades, exclude the
 * whole-tree root, avoid nested legend entries, and omit clades wider than
 * {@link DEFAULT_RADIAL_LEGEND_MAX_CLADE_SPAN_DEG} on the tip circle.
 */
export const selectRadialLegendClades = <T extends MutableLegendNode & Pick<RadialLayoutNode, "angle">>(
    root: T,
    options: SelectRadialLegendCladesOptions,
): T[] => {
    const legendRingRadius = options.legendRingRadius
    if (!Number.isFinite(legendRingRadius) || legendRingRadius <= 0) {
        throw new Error("selectRadialLegendClades requires legendRingRadius > 0")
    }

    const silhouetteWidth = options.legendSilhouetteWidth ?? DEFAULT_RADIAL_LEGEND_SILHOUETTE_WIDTH
    const slotWidth =
        options.longestLegendLabelWidth !== undefined
            ? radialLegendMinSlotWidthPx(silhouetteWidth, options.longestLegendLabelWidth)
            : silhouetteWidth
    const minLegendSpanRad =
        options.minLegendSpanRad ?? radialLegendMinSpanRadFromSlotWidth(slotWidth, legendRingRadius)
    const maxLegendSpanRad =
        options.maxLegendSpanDeg !== undefined
            ? radialLegendSpanRadFromDegrees(options.maxLegendSpanDeg)
            : (options.maxLegendSpanRad ??
              radialLegendSpanRadFromDegrees(DEFAULT_RADIAL_LEGEND_MAX_CLADE_SPAN_DEG))

    const minDepth = options.minDepth ?? DEFAULT_RADIAL_LEGEND_MIN_DEPTH
    const totalTips = options.totalTipCount ?? countTipsUnderLegendNode(root)

    type Candidate = { node: T; depth: number; tips: number; spanRad: number }
    const candidates: Candidate[] = []
    const visit = (n: T, depth: number) => {
        const tips = countTipsUnderLegendNode(n)
        const spanRad = radialDescendantAngleSpanRad(n)
        if (!isTip(n) && n.label && spanRad >= minLegendSpanRad && spanRad <= maxLegendSpanRad) {
            candidates.push({ node: n, depth, tips, spanRad })
        }
        for (const c of n.children as T[]) visit(c, depth + 1)
    }
    visit(root, 0)

    const parentMap = buildParentMap(root)
    const pool = candidates
        .filter(c => c.tips < totalTips && c.depth >= minDepth)
        .sort((a, b) => b.depth - a.depth || b.tips - a.tips)

    const legend: T[] = []
    for (const c of pool) {
        if (legend.some(existing => isDescendantOf(c.node, existing, parentMap))) continue
        legend.push(c.node)
    }
    return legend
}
