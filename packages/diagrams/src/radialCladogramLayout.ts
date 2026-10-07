/**
 * Radial (circular) cladogram layout: root at center, tips on a circle.
 * Reference for MCP agents and unit tests — no SVG emission here.
 */

import { measureLabel } from "./measureLabel.js"
import { DEFAULT_SVG_LABEL_FONT, type SvgLabelFont } from "./newickLabelStyle.js"

export type RadialLayoutTreeShape = Readonly<{
    label?: string
    children: readonly RadialLayoutTreeShape[]
}>

export type RadialLayoutNode = {
    label?: string
    children: RadialLayoutNode[]
    /** Tree depth from root (root = 0). */
    depth?: number
    /** Bearing in radians; tips in contiguous sibling sectors, internals = mean of children. */
    angle?: number
}

export type RadialCladogramTheme = Readonly<{
    /** Radius of the tip branch anchor (circle where edges meet tips). */
    tipRadius: number
    /** Outward offset from tip anchor to silhouette center (outer rim). */
    silhouetteOutset: number
    /** Outward offset from the tip circle along the spoke (label sits between tip ring and silhouettes). */
    labelOutset: number
    /** First tip angle in radians; default −π/2 (12 o'clock). */
    startAngle: number
    /** Angular span for tip placement; default 2π (full circle). */
    sweepAngle: number
}>

export const DEFAULT_RADIAL_CLADOGRAM_THEME: RadialCladogramTheme = {
    tipRadius: 280,
    silhouetteOutset: 36,
    labelOutset: 10,
    startAngle: -Math.PI / 2,
    sweepAngle: 2 * Math.PI,
}

export type RadialLayoutResult = Readonly<{
    root: RadialLayoutNode
    tipCount: number
    maxDepth: number
    theme: RadialCladogramTheme
}>

const isTipShape = (n: { children: readonly unknown[] }) => n.children.length === 0

export const collectRadialTipsInOrder = <T extends { children: T[] }>(n: T, out: T[] = []): T[] => {
    if (isTipShape(n)) {
        out.push(n)
        return out
    }
    for (const child of n.children) {
        collectRadialTipsInOrder(child, out)
    }
    return out
}

/** Tips descended from `n` (includes `n` when `n` is a tip). */
export const radialTipsUnder = (n: RadialLayoutNode): RadialLayoutNode[] => {
    if (isTipShape(n)) {
        return [n]
    }
    return n.children.flatMap(c => radialTipsUnder(c))
}

export type RadialAngleRange = Readonly<{ min: number; max: number }>

/** Angular span of all descendant tips (contiguous sector on the tip circle). */
export const radialDescendantAngleRange = (n: RadialLayoutNode): RadialAngleRange => {
    const tips = radialTipsUnder(n)
    const angles = tips.map(t => t.angle ?? 0)
    return { min: Math.min(...angles), max: Math.max(...angles) }
}

/** Angular span of **immediate children** only (ancestral arc on the node’s circle). */
export const radialImmediateChildAngleRange = (n: RadialLayoutNode): RadialAngleRange => {
    if (isTipShape(n) || n.children.length === 0) {
        const a = n.angle ?? 0
        return { min: a, max: a }
    }
    const angles = n.children.map(c => c.angle ?? 0)
    return { min: Math.min(...angles), max: Math.max(...angles) }
}

const setDepth = (n: RadialLayoutNode, d: number): number => {
    n.depth = d
    if (isTipShape(n)) {
        return d
    }
    let max = d
    for (const child of n.children) {
        max = Math.max(max, setDepth(child, d + 1))
    }
    return max
}

const countTipsUnder = (n: RadialLayoutNode): number => {
    if (isTipShape(n)) {
        return 1
    }
    return n.children.reduce((sum, c) => sum + countTipsUnder(c), 0)
}

/**
 * Contiguous angular sectors per subtree (same tip order as basic rectangular layout).
 * Each child branch owns a wedge of the parent's span proportional to its tip count.
 */
const assignAngularSectors = (n: RadialLayoutNode, angleStart: number, angleEnd: number): void => {
    if (isTipShape(n)) {
        n.angle = (angleStart + angleEnd) / 2
        return
    }
    const total = countTipsUnder(n)
    const span = angleEnd - angleStart
    let cursor = angleStart
    for (const child of n.children) {
        const t = countTipsUnder(child)
        const childEnd = cursor + (t / total) * span
        assignAngularSectors(child, cursor, childEnd)
        cursor = childEnd
    }
    const sum = n.children.reduce((acc, c) => acc + (c.angle ?? 0), 0)
    n.angle = sum / n.children.length
}

/** Clone tree shape into mutable layout nodes (labels preserved). */
export const cloneRadialLayoutTree = (shape: RadialLayoutTreeShape): RadialLayoutNode => ({
    label: shape.label,
    children: shape.children.map(cloneRadialLayoutTree),
})

/**
 * Assign depth and bearings: tips in Newick DFS order around the circle without interleaving clades.
 */
export const assignRadialCladogramLayout = (
    root: RadialLayoutNode,
    theme: RadialCladogramTheme = DEFAULT_RADIAL_CLADOGRAM_THEME,
): RadialLayoutResult => {
    const maxDepth = setDepth(root, 0)
    assignAngularSectors(root, theme.startAngle, theme.startAngle + theme.sweepAngle)
    const tips = collectRadialTipsInOrder(root)
    return { root, tipCount: tips.length, maxDepth, theme }
}

/** Radial distance for a node on its branch (root at center). Tips always sit on the tip circle. */
export const radialNodeRadius = (
    node: Pick<RadialLayoutNode, "depth" | "children">,
    maxDepth: number,
    theme: RadialCladogramTheme,
): number => {
    if (isTipShape(node)) {
        return theme.tipRadius
    }
    if (maxDepth <= 0) {
        return 0
    }
    const d = node.depth ?? 0
    return (d / maxDepth) * theme.tipRadius
}

export const polarToCartesian = (radius: number, angle: number): { x: number; y: number } => ({
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
})

/** Branch anchor in layout coordinates (origin = root). */
export const radialBranchPoint = (
    node: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): { x: number; y: number } => {
    const r = radialNodeRadius(node, maxDepth, theme)
    const theta = node.angle ?? 0
    return polarToCartesian(r, theta)
}

/** Silhouette center on the outer rim (outside tip anchor). */
export const radialSilhouettePoint = (
    node: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): { x: number; y: number } => {
    const r = radialNodeRadius(node, maxDepth, theme) + theme.silhouetteOutset
    const theta = node.angle ?? 0
    return polarToCartesian(r, theta)
}

/** Label anchor on the tip’s spoke, just outside the tip circle. */
export const radialLabelPoint = (
    node: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): { x: number; y: number } => {
    const r = radialNodeRadius(node, maxDepth, theme) + theme.labelOutset
    const theta = node.angle ?? 0
    return polarToCartesian(r, theta)
}

export type RadialLabelTextPlacement = Readonly<{
    rotationDeg: number
    textAnchor: "start" | "end"
}>

/**
 * Label along the spoke at {@link radialLabelPoint}: outward from center, upright on the left half-plane.
 */
export const radialLabelTextPlacement = (angleRad: number): RadialLabelTextPlacement => {
    const rotationDeg = (angleRad * 180) / Math.PI
    if (Math.cos(angleRad) < 0) {
        return { rotationDeg: rotationDeg + 180, textAnchor: "end" }
    }
    return { rotationDeg, textAnchor: "start" }
}

/** @deprecated Prefer {@link radialLabelTextPlacement} (left-side labels use `text-anchor="end"` and +180°). */
export const radialLabelRotationDeg = (angleRad: number): number =>
    radialLabelTextPlacement(angleRad).rotationDeg

export type RadialInnerRingLabelTextPlacement = Readonly<{
    rotationDeg: number
    /** Center of the label sits on the clade spoke (`text-anchor="middle"`). */
    textAnchor: "middle"
}>

/**
 * Clade / inner-ring labels (e.g. clade-key mode): place the **center** on the spoke at θ;
 * tangent orientation (**90° clockwise** from {@link radialLabelTextPlacement}), flipped on the
 * **bottom** half-plane (`sin θ > 0`) so the label at 6 o'clock stays upright.
 */
export const radialInnerRingLabelTextPlacement = (angleRad: number): RadialInnerRingLabelTextPlacement => {
    let rotationDeg = (angleRad * 180) / Math.PI + 90
    if (Math.sin(angleRad) > 0) {
        rotationDeg += 180
    }
    return { rotationDeg, textAnchor: "middle" }
}

/** Label radius inside the silhouette ring (midway between branch circle and outer rim). */
export const radialInnerRingLabelRadius = (theme: RadialCladogramTheme): number =>
    theme.tipRadius + theme.silhouetteOutset / 2

/** Ancestral (internal) nodes are never labeled or illustrated in radial style. */
export const radialNodeShowsLabel = (node: RadialLayoutNode): boolean => isTipShape(node)

export const radialNodeShowsSilhouette = (node: RadialLayoutNode): boolean => isTipShape(node)

/** Shortest signed angle from `from` to `to` (radians). */
export const radialAngleDelta = (from: number, to: number): number => {
    let d = to - from
    while (d > Math.PI) d -= 2 * Math.PI
    while (d <= -Math.PI) d += 2 * Math.PI
    return d
}

export type RadialPolarPoint = Readonly<{ r: number; theta: number }>

export const radialNodePolar = (
    node: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): RadialPolarPoint => ({
    r: radialNodeRadius(node, maxDepth, theme),
    theta: node.angle ?? 0,
})

/**
 * Ancestral rail: arc on this node’s depth circle spanning its **immediate children** only.
 * Omit when the node is a tip, at the origin, or descendants share one bearing.
 */
export const radialAncestralArcPath = (
    node: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): string | null => {
    if (isTipShape(node)) {
        return null
    }
    const r = radialNodeRadius(node, maxDepth, theme)
    if (r <= 0) {
        return null
    }
    const { min, max } = radialImmediateChildAngleRange(node)
    const delta = radialAngleDelta(min, max)
    if (Math.abs(delta) < 1e-10) {
        return null
    }
    const start = polarToCartesian(r, min)
    const end = polarToCartesian(r, max)
    const large = Math.abs(delta) > Math.PI ? 1 : 0
    const sweep = delta > 0 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`
}

/**
 * Radial spoke (constant θ through the center): from the parent circle to the child on the **child’s** bearing.
 * Terminals end on the tip circle; internals end on the child’s depth circle. Root uses a spoke from the origin.
 */
export const radialBranchEdgePath = (
    parent: RadialLayoutNode,
    child: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): string => {
    const tC = child.angle ?? 0
    const rP = radialNodeRadius(parent, maxDepth, theme)
    const rEnd = isTipShape(child)
        ? theme.tipRadius
        : radialNodeRadius(child, maxDepth, theme)

    if (rP <= 0) {
        const end = polarToCartesian(rEnd, tC)
        return `M 0 0 L ${end.x} ${end.y}`
    }

    const start = polarToCartesian(rP, tC)
    const end = polarToCartesian(rEnd, tC)
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

/**
 * SVG rotation (degrees) for a silhouette on the outer rim: slot bottom points toward the origin.
 * Use with `translate(cx,cy) rotate(deg)` then bottom-align art in a square slot above the origin.
 */
export const radialSilhouetteRotationDeg = (angleRad: number): number => (angleRad * 180) / Math.PI + 90

/** Same bottom-half +180° as {@link radialInnerRingLabelTextPlacement} (e.g. clade-key rim silhouettes). */
export const radialInnerRingSilhouetteRotationDeg = (angleRad: number): number => {
    let deg = radialSilhouetteRotationDeg(angleRad)
    if (Math.sin(angleRad) > 0) {
        deg += 180
    }
    return deg
}

/** @deprecated Use radialBranchEdgePath (radial spokes + concentric arcs). */
export const radialBranchSegment = (
    parent: RadialLayoutNode,
    child: RadialLayoutNode,
    maxDepth: number,
    theme: RadialCladogramTheme,
): { x1: number; y1: number; x2: number; y2: number } => {
    const p = radialBranchPoint(parent, maxDepth, theme)
    const c = radialBranchPoint(child, maxDepth, theme)
    return { x1: p.x, y1: p.y, x2: c.x, y2: c.y }
}

/** Circular mean of bearings (radians), e.g. clade silhouette placement on the outer ring. */
export const meanAngleRad = (angles: readonly number[]): number => {
    if (!angles.length) return 0
    let sin = 0
    let cos = 0
    for (const a of angles) {
        sin += Math.sin(a)
        cos += Math.cos(a)
    }
    return Math.atan2(sin, cos)
}

/** Widest tip label (px), for viewBox padding when tips are labeled. */
export const radialMaxTipLabelWidth = (
    tips: readonly Pick<RadialLayoutNode, "label">[],
    font: SvgLabelFont = DEFAULT_SVG_LABEL_FONT,
): number => {
    let max = 0
    for (const tip of tips) {
        if (!tip.label) continue
        max = Math.max(max, measureLabel(tip.label, font).width)
    }
    return max
}

/**
 * {@link RadialCladogramTheme.tipRadius} for labeled-tip figures: inset the **branch circle**
 * from {@link outerLayoutRadius} so the radial band outside branches fits labels
 * ({@link RadialCladogramTheme.labelOutset} + {@link maxLabelWidth}) before silhouettes on the outer ring.
 * Set `silhouetteOutset` to `outerLayoutRadius −` this return value so {@link radialSilhouettePoint} sits on the outer radius.
 */
export const radialBranchTipRadiusForLabels = (
    outerLayoutRadius: number,
    theme: Pick<RadialCladogramTheme, "labelOutset">,
    maxLabelWidth: number,
    minTipRadius = 48,
): number => {
    const labelBand = theme.labelOutset + maxLabelWidth
    return Math.max(minTipRadius, outerLayoutRadius - labelBand)
}

/** Square viewBox half-extent from layout origin when silhouettes sit at `outerLayoutRadius`. */
export const radialOuterLayoutViewBoxHalfExtent = (
    outerLayoutRadius: number,
    silhouetteSlotSize: number,
    viewBoxTailPad = 40,
): number => outerLayoutRadius + silhouetteSlotSize + viewBoxTailPad

/** Suggested tip count above which agents may omit per-tip labels and use a clade color key. */
export const RADIAL_CLADE_KEY_TIP_THRESHOLD = 48

export type RadialCladeKeyEntry = Readonly<{
    cladeId: string
    displayName: string
    color: string
}>

/** Map each tip key (id or label) to a clade id for color bands and key-only silhouettes. */
export const assignRadialTipClades = (
    root: RadialLayoutNode,
    tipToCladeId: ReadonlyMap<string, string>,
    tipKey: (tip: RadialLayoutNode) => string = (tip) => tip.label ?? "",
): Map<string, string> => {
    const out = new Map<string, string>()
    for (const tip of collectRadialTipsInOrder(root)) {
        const id = tipKey(tip)
        const clade = tipToCladeId.get(id)
        if (clade) {
            out.set(id, clade)
        }
    }
    return out
}
