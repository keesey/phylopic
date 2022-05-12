import { Entity, Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import React, { FC, useCallback, useState } from "react"
import Modal from "~/ui/Modal"
import UUIDSelector from "../UUIDSelector"

export interface Props {
    onSelect: (node: Entity<Node> | undefined) => void
    open?: boolean
}
const NodeSelector: FC<Props> = ({ open, onSelect }) => {
    const [pending, setPending] = useState(false)
    const handleUUIDSelect = useCallback(
        (uuid?: UUID) => {
            if (!uuid) {
                return onSelect(undefined)
            }
            ;(async () => {
                setPending(true)
                try {
                    const result = await fetch(`/api/nodes/${uuid}`)
                    if (!result.ok) {
                        throw new Error(result.statusText)
                    }
                    const value: Node = await result.json()
                    onSelect({ uuid, value })
                } catch (e) {
                    alert(e)
                } finally {
                    setPending(false)
                }
            })()
        },
        [onSelect],
    )
    if (!open) {
        return null
    }
    return (
        <Modal onClose={() => onSelect(undefined)} title="Select Node">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={pending ? "pending" : undefined}>
                Enter a UUID:
                <br />
                {/* eslint-disable jsx-a11y/no-autofocus */}
                <UUIDSelector
                    autoFocus
                    onSelect={handleUUIDSelect}
                    placeholder="00000000-0000-0000-0000-000000000000"
                />
                {/* eslint-enable jsx-a11y/no-autofocus */}
            </label>
        </Modal>
    )
}
export default NodeSelector
