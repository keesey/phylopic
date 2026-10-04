import type { PickImageOptions } from "./types.js"

type TreeNodeWithParent = Readonly<{
    parent?: Readonly<{ id: string }> | undefined
}>

/** PhyloPic UUID for the cladogram parent node, if any (ancestral walk stops here; no image above). */
export const cladogramParentPhyloUuid = (
    node: TreeNodeWithParent,
    phyloUuidByTreeId: Readonly<Record<string, string>>,
): string | undefined => (node.parent ? phyloUuidByTreeId[node.parent.id] : undefined)

export const ancestralPickOptions = (
    filters: PickImageOptions,
    node: TreeNodeWithParent,
    phyloUuidByTreeId: Readonly<Record<string, string>>,
    extra?: PickImageOptions,
): PickImageOptions => {
    const parentUuid = cladogramParentPhyloUuid(node, phyloUuidByTreeId)
    return {
        ...filters,
        image_list: "ancestral",
        ...(parentUuid ? { exclude_node_uuids: [parentUuid] } : {}),
        ...extra,
    }
}
