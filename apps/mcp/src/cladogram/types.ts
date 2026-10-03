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

/** Default pick uses primary (when node-accurate) then clade page 0 index 0. Overrides skip that policy. */
export type PickImageOptions = LicenseFilters &
    Readonly<{
        image_uuid?: string
        clade_index?: number
        clade_page?: number
    }>
