import { Entity, Image, Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
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
const NodesEditor: FC<Props> = ({ uuid }) => {
    const { data } = useSWR<Image & { uuid: UUID }>(`/api/images/_/${encodeURIComponent(uuid)}`, fetchJSON)
    if (!data) {
        return null
    }
    if (!data.specific) {
        return <>[Unassigned]</>
    }
    return (
        <section>
            <Paginator endpoint={`/api/nodes/_/${data.specific}/lineage`}>
                {(items, isValidating) =>
                    items.length > 0 ? (
                        <LineageEditor image={data} nodes={items as ReadonlyArray<Node & { uuid: UUID }>} />
                    ) : isValidating ? null : (
                        "[None found]"
                    )
                }
            </Paginator>
        </section>
    )
}
export default NodesEditor
const LineageEditor: FC<{
    image: Image & { uuid: UUID }
    nodes: ReadonlyArray<Node & { uuid: UUID }>
}> = ({ image, nodes }) => {
    const [expanded, setExpanded] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const lastIndex = useMemo(
        () => nodes.findIndex(node => node.uuid === (image.general ?? image.specific)) + 1,
        [image.general, image.specific, nodes],
    )
    const nodesToShow = useMemo(() => (expanded ? nodes : nodes.slice(0, lastIndex)), [expanded, lastIndex, nodes])
    const imageKey = `/api/images/_/${encodeURIComponent(image.uuid)}`
    const imageResponse = useSWR<Image & { uuid: UUID }>(imageKey, fetchJSON)
    const patcher = useModifiedPatcher(imageKey, imageResponse)
    const setGeneral = useCallback((value: UUID | null) => patcher({ general: value }), [patcher])
    const handleNodeSelect = useCallback(
        (value: Entity<Node> | undefined) => {
            setModalOpen(false)
            if (value && image.specific !== value.uuid) {
                patcher({ specific: value.uuid, general: null })
            }
        },
        [image.specific, patcher],
    )
    return (
        <>
            <BubbleList>
                {nodesToShow.map((node, index) => (
                    <BubbleNode key={node.uuid} light={index >= lastIndex}>
                        <Link href={`/nodes/${node.uuid}`}>
                            <NameView
                                name={node.names[0]}
                                short={node.uuid !== image.specific && node.uuid !== image.general}
                            />
                        </Link>
                        {node.uuid === image.specific && (
                            <button onClick={() => setModalOpen(true)} title="Change Specific Node">
                                ✎
                            </button>
                        )}
                        {node.uuid !== image.general && index > 0 && (
                            <button onClick={() => setGeneral(node.uuid)} title="Select as General Node">
                                G
                            </button>
                        )}
                        {node.uuid === image.general && (
                            <button onClick={() => setGeneral(null)} title="Unselect as General Node">
                                ✗
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
            <NodeSelector onSelect={handleNodeSelect} open={modalOpen} />
        </>
    )
}
