export type CladogramTreeNode = Readonly<{
    id: string
    label?: string
    branchLength?: number
    children: readonly CladogramTreeNode[]
}>

export type CladogramTree = Readonly<{
    root: CladogramTreeNode
    tipCount: number
}>

export type PickedImage = Readonly<{
    uuid: string
    vectorUrl?: string
    sourceUrl?: string
    license?: string
    attribution?: string | null
    /** https://www.phylopic.org/images/{uuid} */
    pageUrl?: string
}>

export type PickImageResult = Readonly<{
    nodeUuid: string
    /** https://www.phylopic.org/nodes/{nodeUuid} */
    nodePageUrl?: string
    image: PickedImage | null
    warnings?: readonly string[]
}>

export type LicenseFilters = Readonly<{
    filter_license_by?: "true" | "false"
    filter_license_nc?: "true" | "false"
    filter_license_sa?: "true" | "false"
}>

/** Default pick uses primary (when on image general→specific lineage, same rule as filter_node) then list page 0. Overrides skip that policy. */
export type PickImageOptions = LicenseFilters &
    Readonly<{
        image_uuid?: string
        clade_index?: number
        clade_page?: number
        /**
         * `clade` (default): fallback list uses filter_clade (node + subtaxa)—typical for terminal taxa.
         * `node`: filter_node (images whose general→specific tagged lineage includes this node).
         * `ancestral`: filter_node on this node, then each ancestor in lineage until a hit; stop at exclude_node_uuids (cladogram parent)—no image above that rank.
         */
        image_list?: "clade" | "node" | "ancestral"
        /** Cladogram parent PhyloPic UUID: do not use its silhouette; stop the ancestral walk here (no picks from higher ancestors). */
        exclude_node_uuids?: readonly string[]
        /** For unlabeled Newick nodes: PhyloPic UUIDs of labeled subclade roots beneath that node. */
        descendant_node_uuids?: readonly string[]
    }>
