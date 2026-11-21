import type { Node } from "@phylopic/api-models"
import { shortenNomen, stringifyNomen } from "@phylopic/utils"
import type { PhyloPicClient } from "../client/PhyloPicClient.js"
import { nodeTitle } from "../search/phylopicNameMatch.js"
import { cladogramTreeToNewick } from "./cladogramTreeToNewick.js"
import { resolveLabelForCladogramNode } from "./resolveLabelViaDescendantPhylogeny.js"
import type { BuildTreeFromTerminalsResult, TerminalTaxon } from "./buildTreeFromTerminals.js"
import type { CladogramTreeNode } from "./types.js"

type NodeWithEmbeddedChildren = Node &
    Readonly<{
        _embedded?: Readonly<{
            childNodes?: readonly Node[]
        }>
    }>

export type BuildTreeFromPhyloPicSubtreeOptions = Readonly<{
    /**
     * Deepest tip depth below the root (0 = root only as tip; 3 = through great-grandchildren).
     * Default 3.
     */
    maxTipDepth?: number
    /** Abort if the tree would exceed this many nodes (default 500). */
    maxNodes?: number
}>

const DEFAULT_MAX_TIP_DEPTH = 3
const DEFAULT_MAX_NODES = 500

export const labelFromPhylopicNode = (node: Node): string => {
    const nomen = node.names?.[0]
    if (nomen) {
        return stringifyNomen(shortenNomen(nomen))
    }
    const title = nodeTitle(node)
    if (title?.trim()) {
        return title.trim()
    }
    return String(node.uuid)
}

const countTips = (node: CladogramTreeNode): number => {
    if (!node.children.length) {
        return 1
    }
    return node.children.reduce((sum, child) => sum + countTips(child), 0)
}

const fetchNodeWithChildren = (client: PhyloPicClient, nodeUuid: string) =>
    client.getJson<NodeWithEmbeddedChildren>(`/nodes/${nodeUuid}`, { embed_childNodes: true })

export const buildTreeFromPhyloPicNodeUuid = async (
    client: PhyloPicClient,
    rootNodeUuid: string,
    options: BuildTreeFromPhyloPicSubtreeOptions = {},
): Promise<BuildTreeFromTerminalsResult> => {
    const maxTipDepth = options.maxTipDepth ?? DEFAULT_MAX_TIP_DEPTH
    const maxNodes = options.maxNodes ?? DEFAULT_MAX_NODES
    if (maxTipDepth < 0) {
        throw new Error("maxTipDepth must be >= 0.")
    }

    const warnings: string[] = []
    const nodeUuidByTreeId: Record<string, string> = {}
    const terminals: TerminalTaxon[] = []
    let nextId = 0
    let nodeCount = 0

    const buildAt = async (nodeUuid: string, depth: number): Promise<CladogramTreeNode> => {
        if (nodeCount >= maxNodes) {
            throw new Error(`PhyloPic subtree exceeds maxNodes (${maxNodes}).`)
        }
        nodeCount += 1
        const id = `n${nextId++}`
        nodeUuidByTreeId[id] = nodeUuid

        const node = await fetchNodeWithChildren(client, nodeUuid)
        const label = labelFromPhylopicNode(node)
        const embeddedChildren = node._embedded?.childNodes ?? []
        const linkChildCount = node._links?.childNodes?.length ?? embeddedChildren.length
        if (linkChildCount > embeddedChildren.length) {
            warnings.push(
                `Node "${label}" (${nodeUuid}) has ${linkChildCount} children but only ${embeddedChildren.length} were embedded; subtree may be incomplete.`,
            )
        }

        const atTipDepth = depth >= maxTipDepth
        const children =
            atTipDepth || !embeddedChildren.length ?
                []
            :   (
                    await Promise.all(
                        [...embeddedChildren]
                            .sort((a, b) =>
                                labelFromPhylopicNode(a).localeCompare(labelFromPhylopicNode(b), undefined, {
                                    sensitivity: "base",
                                }),
                            )
                            .map(child => buildAt(String(child.uuid), depth + 1)),
                    )
                )

        if (!children.length) {
            terminals.push({ label, nodeUuid })
        }
        return { id, label, children }
    }

    const root = await buildAt(rootNodeUuid, 0)
    const tree = { root, tipCount: countTips(root) }
    return {
        tree,
        newick: cladogramTreeToNewick(root),
        nodeUuidByTreeId,
        terminals,
        warnings,
    }
}

export const buildTreeFromPhyloPicLabel = async (
    client: PhyloPicClient,
    label: string,
    options: BuildTreeFromPhyloPicSubtreeOptions = {},
): Promise<BuildTreeFromTerminalsResult> => {
    const resolved = await resolveLabelForCladogramNode(client, label.trim(), [])
    const result = await buildTreeFromPhyloPicNodeUuid(client, resolved.nodeUuid, options)
    return {
        ...result,
        warnings: [...resolved.warnings, ...result.warnings],
    }
}
