/**
 * Lineage lists from GET /nodes/{uuid}/lineage (embed_items): index 0 is the node, increasing toward root.
 * Most leafward common ancestor = deepest shared ancestor = longest common prefix when paths are root → tip.
 */
export const mostLeafwardCommonAncestor = (lineages: readonly (readonly string[])[]): string | null => {
    if (!lineages.length) {
        return null
    }
    const fromRoot = lineages.map(lineage => [...lineage].reverse())
    const minLen = Math.min(...fromRoot.map(lineage => lineage.length))
    let mrca: string | null = null
    for (let i = 0; i < minLen; i++) {
        const candidate = fromRoot[0][i]
        if (fromRoot.every(lineage => lineage[i] === candidate)) {
            mrca = candidate
        } else {
            break
        }
    }
    return mrca
}
