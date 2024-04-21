"use client"
import { FC, useContext } from "react"
import { EditorContext, select } from "~/lib/edit"
import { ControlButton } from "./ControlButton"
export interface Props {
    readOnly: boolean
}
export const UndoButton: FC<Props> = ({ readOnly }) => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    return (
        <ControlButton
            disabled={readOnly || !state || !select.canUndo(state)}
            onClick={() => (readOnly ? undefined : dispatch?.({ type: "UNDO" }))}
        >
            ⟲
        </ControlButton>
    )
}
