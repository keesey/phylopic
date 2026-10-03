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
}>

export type PickImageResult = Readonly<{
    nodeUuid: string
    image: PickedImage | null
    warnings?: readonly string[]
}>

export type LicenseFilters = Readonly<{
    filter_license_by?: "true" | "false"
    filter_license_nc?: "true" | "false"
    filter_license_sa?: "true" | "false"
}>
