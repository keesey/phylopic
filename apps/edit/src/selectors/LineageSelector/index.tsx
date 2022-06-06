import { Entity, Node } from "@phylopic/source-models"
import { FC, useCallback, useState } from "react"
import NodeSelector from "../NodeSelector"

export interface Props {
    onSelect: (lineage: readonly Entity<Node>[]) => void
    open?: boolean
}
const LineageSelector: FC<Props> = ({ onSelect, open }) => {
    const [pending, setPending] = useState(false)
    const handleNodeSelect = useCallback(
        (entity?: Entity<Node>) => {
            if (pending) {
                return
            }
            if (!entity?.uuid) {
                onSelect([])
            } else {
                ;(async () => {
                    setPending(true)
                    try {
                        const result = await fetch(`/api/lineage/${entity.uuid}`)
                        if (!result.ok) {
                            throw new Error(result.statusText)
                        }
                        const value: Entity<Node>[] = await result.json()
                        onSelect(value)
                    } catch (e) {
                        alert(e)
                    } finally {
                        setPending(false)
                    }
                })()
            }
        },
        [pending, onSelect],
    )
    return (
        <div className={pending ? "pending" : undefined}>
            <NodeSelector onSelect={handleNodeSelect} open={open} />
        </div>
    )
}
export default LineageSelector
