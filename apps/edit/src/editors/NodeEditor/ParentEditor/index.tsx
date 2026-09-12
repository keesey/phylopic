import { Entity, Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { stringifyNomen, UUID } from "@phylopic/utils"
import Link from "next/link"
import { FC, useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import Paginator from "~/pagination/Paginator"
import NodeSelector from "~/selectors/NodeSelector"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
import BubbleList from "~/ui/BubbleList"
import BubbleNode from "~/ui/BubbleNode"
import NameView from "~/views/NameView"
export type Props = {
    uuid: UUID
}
const ParentEditor: FC<Props> = ({ uuid }) => {
    const [selecting, setSelecting] = useState(false)
    const nodeKey = `/api/nodes/_/${encodeURIComponent(uuid)}`
    const nodeResponse = useSWR<Node & { uuid: UUID }>(nodeKey, fetchJSON)
    const patcher = useModifiedPatcher(nodeKey, nodeResponse)
    const { data } = nodeResponse
    const selectNew = useCallback(() => setSelecting(true), [])
    const selectNode = useCallback(
        (entity: Entity<Node> | undefined) => {
            try {
                if (entity && entity.uuid !== data?.parent) {
                    if (
                        confirm(
                            `Are you sure you want to change the parent node to ${stringifyNomen(
                                entity.value.names[0],
                            )}?`,
                        )
                    ) {
                        patcher({ parent: entity.uuid })
                    }
                }
            } finally {
                setSelecting(false)
            }
        },
        [data?.parent, patcher],
    )
    if (!data) {
        return null
    }
    if (!data.parent) {
        return (
            <>
                [Unassigned]
                <button title="Add Parent Node" onClick={selectNew}>
                    ✎
                </button>
                <NodeSelector open={selecting} onSelect={selectNode} />
            </>
        )
    }
    return (
        <section>
            <NodeSelector open={selecting} onSelect={selectNode} />
            <Paginator endpoint={`/api/nodes/_/${data.parent}/lineage`}>
                {items => (
                    <LineageEditor
                        nodes={items as ReadonlyArray<Node & { uuid: UUID }>}
                        onSelect={selectNode}
                        onSelectNew={selectNew}
                    />
                )}
            </Paginator>
        </section>
    )
}
export default ParentEditor
const LineageEditor: FC<{
    nodes: ReadonlyArray<Node & { uuid: UUID }>
    onSelect: (value: Entity<Node>) => void
    onSelectNew: () => void
}> = ({ nodes, onSelect, onSelectNew }) => {
    const [expanded, setExpanded] = useState(false)
    const nodesToShow = useMemo(() => (expanded ? nodes : nodes.slice(0, 1)), [expanded, nodes])
    if (!nodes.length) {
        return (
            <BubbleList>
                <BubbleNode>
                    <span>N/A</span>
                    <button title="Set Parent Node" onClick={onSelectNew}>
                        ✎
                    </button>
                </BubbleNode>
            </BubbleList>
        )
    }
    return (
        <BubbleList>
            {nodesToShow.map((node, index) => (
                <BubbleNode key={node.uuid} light={index > 0}>
                    <Link href={`/nodes/${node.uuid}`}>
                        <NameView name={node.names[0]} short={index > 0} />
                    </Link>
                    {index === 0 && (
                        <button title="Change Parent Node" onClick={onSelectNew}>
                            ✎
                        </button>
                    )}
                    {index > 0 && (
                        <button
                            onClick={() => onSelect({ uuid: node.uuid, value: node })}
                            title="Set this Node as the Parent"
                        >
                            𓅡
                        </button>
                    )}
                </BubbleNode>
            ))}
            {!expanded && (
                <a onClick={() => setExpanded(true)} role="button">
                    Expand
                </a>
            )}
            {expanded && (
                <a onClick={() => setExpanded(false)} role="button">
                    Collapse
                </a>
            )}
        </BubbleList>
    )
}
