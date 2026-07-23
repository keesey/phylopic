import { Identifier, type UUID } from "@phylopic/utils"
import { type ParseResult } from "newick-js"
import { CladogramArc, CladogramGraph, CladogramNode } from "../models"
import { parseNomen } from "parse-nomen"
import { QuickLinkNode } from "~/ui/QuickLinks/QuickLinkNode"
const convertQuickLinkNodeToCladogramGraph = (node: QuickLinkNode): CladogramGraph => {
    const nodes = convertQuickLinkNodeToNodes(node)
    const arcs = convertQuickLinkNodeToArcs(node, nodes)
    return { arcs, nodes }
}
export default convertQuickLinkNodeToCladogramGraph
const convertQuickLinkNodeToNodes = (node: QuickLinkNode): CladogramGraph["nodes"] => {
    return [
        {
            identifier: ["phylopic.org", "nodes", node.uuid],
            imageUUID: node.imageUUID,
            label: node.label,
        },
        ...(node.children?.reduce<CladogramGraph["nodes"]>(
            (prev, child) => [...prev, ...convertQuickLinkNodeToNodes(child)],
            [],
        ) ?? []),
    ]
}
const convertQuickLinkNodeToArcs = (node: QuickLinkNode, nodes: CladogramGraph["nodes"]): CladogramGraph["arcs"] => {
    const index = nodes.findIndex(n => n?.identifier?.[2] === node.uuid)
    return [
        ...(node.children?.reduce<CladogramGraph["arcs"]>(
            (prev, child) => [
                ...prev,
                [index, nodes.findIndex(n => n?.identifier?.[2] === child.uuid)] as CladogramArc,
            ],
            [],
        ) ?? []),
        ...(node.children?.reduce<CladogramGraph["arcs"]>(
            (prev, child) => [...prev, ...convertQuickLinkNodeToArcs(child, nodes)],
            [],
        ) ?? []),
    ]
}
