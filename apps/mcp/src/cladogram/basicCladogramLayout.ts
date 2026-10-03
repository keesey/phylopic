/**
 * Basic rectangular cladogram layout (reference for agents and unit tests).
 * All spacing uses measured element sizes passed per node — not character estimates.
 */

import { bottomAlignArtInSquareSlot, type ViewBoxSize } from "./silhouetteViewBox.js"

export type LayoutTreeShape = Readonly<{
    label?: string
    children: readonly LayoutTreeShape[]
}>

export type BasicCladogramTheme = Readonly<{
    /** Gap between silhouette bottom and horizontal rail */
    lineGap: number
    /** Gap between rail and top of label (illustrated nodes) */
    labelGap: number
    /** Clearance between stacked nodes' bounding boxes */
    nodeClearGap: number
    /** Minimum horizontal run after silhouette before the vertical gutter */
    branchStubMin: number
    /** Keep content off vertical connectors (left/right of gutter) */
    gutterMargin: number
    /** Tips: inset image/label from the depth column edge */
    tipContentInset: number
    /** Minimum column pitch when a depth has no sized nodes */
    minColumnPitch: number
}>

export const DEFAULT_BASIC_CLADOGRAM_THEME: BasicCladogramTheme = {
    lineGap: 4,
    labelGap: 4,
    nodeClearGap: 8,
    branchStubMin: 20,
    gutterMargin: 8,
    tipContentInset: 8,
    minColumnPitch: 48,
}

/** Measured box for one node (from SVG getBBox, canvas measureText, etc.). */
export type BasicNodeMeasures = Readonly<{
    hasImage: boolean
    imageWidth: number
    imageHeight: number
    hasLabel: boolean
    labelWidth: number
    labelHeight: number
    isTip: boolean
}>

export const emptyNodeMeasures = (): BasicNodeMeasures => ({
    hasImage: false,
    imageWidth: 0,
    imageHeight: 0,
    hasLabel: false,
    labelWidth: 0,
    labelHeight: 0,
    isTip: false,
})

const contentInset = (m: BasicNodeMeasures, theme: BasicCladogramTheme) =>
    m.isTip ? theme.tipContentInset : 0

/** Right edge of silhouettes/labels/stub before the gutter margin. */
export const columnInnerEnd = (m: BasicNodeMeasures, theme: BasicCladogramTheme): number => {
    if (!m.hasImage && !m.hasLabel) {
        return 0
    }
    const inset = contentInset(m, theme)
    const imageEnd = m.hasImage ? inset + m.imageWidth : 0
    const labelEnd = m.hasLabel ? inset + m.labelWidth : 0
    const contentEnd = Math.max(imageEnd, labelEnd)
    const branchEnd =
        m.hasImage ? inset + m.imageWidth + theme.branchStubMin : theme.branchStubMin
    return Math.max(contentEnd, branchEnd)
}

/** Horizontal extent from column left to child column start; empty nodes still clear their own connector. */
export const nodeColumnExtent = (m: BasicNodeMeasures, theme: BasicCladogramTheme): number =>
    verticalGutterOffset(m, theme) + theme.gutterMargin

/** Distance from rail up to top of node content. */
export const extentAboveRail = (m: BasicNodeMeasures, theme: BasicCladogramTheme): number => {
    if (!m.hasImage) {
        return 0
    }
    return m.imageHeight + theme.lineGap
}

/** Distance from rail down to bottom of node content. */
export const extentBelowRail = (m: BasicNodeMeasures, theme: BasicCladogramTheme): number => {
    if (!m.hasLabel) {
        return 0
    }
    if (m.isTip && !m.hasImage) {
        return m.labelHeight / 2
    }
    return theme.labelGap + m.labelHeight
}

export type RailLayoutNode = LayoutTreeShape & {
    railY?: number
    children: RailLayoutNode[]
}

const isTipShape = (n: LayoutTreeShape) => n.children.length === 0

const collectTipsInOrder = <T extends RailLayoutNode>(n: T, out: T[] = []): T[] => {
    if (isTipShape(n)) {
        out.push(n)
        return out
    }
    for (const child of n.children) {
        collectTipsInOrder(child as T, out)
    }
    return out
}

const tipsUnder = <T extends RailLayoutNode>(n: T): T[] => {
    const out: T[] = []
    const walk = (x: T) => {
        if (isTipShape(x)) {
            out.push(x)
            return
        }
        for (const c of x.children) {
            walk(c as T)
        }
    }
    walk(n)
    return out
}

export const minTipRailSeparation = <T extends RailLayoutNode>(
    prev: T,
    next: T,
    measures: (n: T) => BasicNodeMeasures,
    theme: BasicCladogramTheme,
) => {
    const a = measures(prev)
    const b = measures(next)
    return extentBelowRail(a, theme) + extentAboveRail(b, theme) + theme.nodeClearGap
}

const minSpanForInternal = <T extends RailLayoutNode>(
    n: T,
    measures: (node: T) => BasicNodeMeasures,
    theme: BasicCladogramTheme,
) => {
    const m = measures(n)
    return (
        extentAboveRail(m, theme) +
        extentBelowRail(m, theme) +
        2 * theme.nodeClearGap
    )
}

const collectLabeledInternals = <T extends RailLayoutNode>(n: T, out: T[] = []): T[] => {
    if (n.label && n.children.length > 0) {
        out.push(n)
    }
    for (const child of n.children) {
        collectLabeledInternals(child as T, out)
    }
    return out
}

/**
 * Assign railY: tips packed in Newick order; internal nodes at the mean railY of immediate children.
 */
export const assignBasicCladogramRails = <T extends RailLayoutNode>(
    root: T,
    measures: (n: T) => BasicNodeMeasures,
    theme: BasicCladogramTheme = DEFAULT_BASIC_CLADOGRAM_THEME,
): void => {
    const tips = collectTipsInOrder(root)
    if (!tips.length) {
        return
    }

    tips[0]!.railY = 0
    for (let i = 1; i < tips.length; i++) {
        const prev = tips[i - 1]!
        const curr = tips[i]!
        curr.railY = prev.railY! + minTipRailSeparation(prev, curr, measures, theme)
    }

    const labeled = collectLabeledInternals(root).sort(
        (a, b) => tipsUnder(b).length - tipsUnder(a).length,
    )

    for (let pass = 0; pass < 24; pass++) {
        let moved = false
        for (const node of labeled) {
            const under = tipsUnder(node)
            if (under.length < 2) {
                continue
            }
            const indices = under.map(t => tips.indexOf(t)).sort((a, b) => a - b)
            const j = indices[0]!
            const k = indices[indices.length - 1]!
            const need = minSpanForInternal(node, measures, theme)
            const span = tips[k]!.railY! - tips[j]!.railY!
            if (span < need) {
                const delta = need - span
                tips[k]!.railY = tips[k]!.railY! + delta
                for (let i = k + 1; i < tips.length; i++) {
                    tips[i]!.railY = tips[i]!.railY! + delta
                }
                moved = true
            }
        }
        if (!moved) {
            break
        }
    }

    const setInternalRails = (n: T) => {
        if (isTipShape(n)) {
            return
        }
        for (const child of n.children) {
            setInternalRails(child as T)
        }
        const ys = n.children.map(c => c.railY!)
        n.railY = (Math.min(...ys) + Math.max(...ys)) / 2
    }
    setInternalRails(root)
}

export type ColumnLayoutNode = Readonly<{
    depth: number
    label?: string
    children: readonly unknown[]
}>

export type ColumnLayoutTree = Readonly<{
    x?: number
    children: readonly ColumnLayoutTree[]
}>

/**
 * Each child column starts immediately after its parent's column extent.
 * Siblings share the same x; unrelated branches do not widen each other.
 */
export const assignBasicCladogramColumnsFromTree = <T extends ColumnLayoutTree>(
    root: T,
    measures: (n: T) => BasicNodeMeasures,
    theme: BasicCladogramTheme = DEFAULT_BASIC_CLADOGRAM_THEME,
): void => {
    root.x = 0
    const walk = (n: T) => {
        const childX = (n.x ?? 0) + nodeColumnExtent(measures(n), theme)
        for (const child of n.children) {
            ;(child as T).x = childX
        }
        for (const child of n.children) {
            walk(child as T)
        }
    }
    walk(root)
}

/** Vertical connector x offset from column left (after label/image + margin). */
export const verticalGutterOffset = (m: BasicNodeMeasures, theme: BasicCladogramTheme): number => {
    const inner = columnInnerEnd(m, theme)
    if (inner === 0) {
        return theme.branchStubMin
    }
    return inner + (m.hasLabel ? theme.gutterMargin : 0)
}

/** Place vector artwork bottom-center inside a square layout slot (slot coords → SVG coords). */
export const silhouettePlacementInSlot = (
    slotSize: number,
    artViewBox: ViewBoxSize,
): ReturnType<typeof bottomAlignArtInSquareSlot> => bottomAlignArtInSquareSlot(slotSize, artViewBox)

export const silhouetteTopY = (
    railY: number,
    m: BasicNodeMeasures,
    theme: BasicCladogramTheme,
): number => {
    if (!m.hasImage) {
        return railY
    }
    return railY - theme.lineGap - m.imageHeight
}

export const contentBottomY = (
    railY: number,
    m: BasicNodeMeasures,
    theme: BasicCladogramTheme,
): number => {
    if (!m.hasLabel) {
        return railY
    }
    if (m.isTip && !m.hasImage) {
        return railY + m.labelHeight / 2
    }
    return railY + theme.labelGap + m.labelHeight
}
