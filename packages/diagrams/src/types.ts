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

export type TerminalTaxon = Readonly<{
    label: string
    nodeUuid: string
}>

export type CollectionCladogramTree = Readonly<{
    tree: CladogramTree
    nodeUuidByTreeId: Readonly<Record<string, string>>
    imageUuidByTreeId: Readonly<Record<string, string>>
    terminals: readonly TerminalTaxon[]
    warnings: readonly string[]
}>
