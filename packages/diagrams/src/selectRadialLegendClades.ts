/**
 * Pick named internal nodes to label on radial clade-key figures (rim silhouettes + inner ring).
 */

export type RadialLegendTreeNode = Readonly<{
    label?: string
    children: readonly RadialLegendTreeNode[]
}>

export type SelectRadialLegendCladesOptions = Readonly<{
    /** Minimum descendant tips for a labeled internal to qualify. Default 12. */
    minTipsUnder?: number
    /** Maximum clades on the rim. Default 28. */
    maxLegendClades?: number
    /** Skip shallow internals (default 2 — not immediate children of the root). */
    minDepth?: number
    /** Total tip count; computed from the root when omitted. */
    totalTipCount?: number
}>

export const DEFAULT_RADIAL_LEGEND_MIN_TIPS = 12
export const DEFAULT_RADIAL_LEGEND_MAX_CLADES = 28
export const DEFAULT_RADIAL_LEGEND_MIN_DEPTH = 2

const isTip = (n: RadialLegendTreeNode): boolean => n.children.length === 0

/** Descendant tip count (includes `n` when `n` is a tip). */
export const countTipsUnderLegendNode = (n: RadialLegendTreeNode): number => {
    if (isTip(n)) return 1
    return n.children.reduce((sum, c) => sum + countTipsUnderLegendNode(c), 0)
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
 * Rationale (tuned on large actinopterygian trees): use **named internal nodes** from the
 * hierarchy, require a **minimum subtree size**, prefer **deeper / more specific** clades,
 * exclude the **whole-tree** root clade, avoid **nested** legend entries, and cap count for
 * legibility on the outer ring.
 */
export const selectRadialLegendClades = <T extends MutableLegendNode>(
    root: T,
    options: SelectRadialLegendCladesOptions = {},
): T[] => {
    const minTipsUnder = options.minTipsUnder ?? DEFAULT_RADIAL_LEGEND_MIN_TIPS
    const maxLegendClades = options.maxLegendClades ?? DEFAULT_RADIAL_LEGEND_MAX_CLADES
    const minDepth = options.minDepth ?? DEFAULT_RADIAL_LEGEND_MIN_DEPTH
    const totalTips = options.totalTipCount ?? countTipsUnderLegendNode(root)

    type Candidate = { node: T; depth: number; tips: number }
    const candidates: Candidate[] = []
    const visit = (n: T, depth: number) => {
        const tips = countTipsUnderLegendNode(n)
        if (!isTip(n) && n.label && tips >= minTipsUnder) {
            candidates.push({ node: n, depth, tips })
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
        if (legend.length >= maxLegendClades) break
        if (legend.some(existing => isDescendantOf(c.node, existing, parentMap))) continue
        legend.push(c.node)
    }
    return legend
}
