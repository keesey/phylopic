"use client"
import { useContext } from "react"
import { EditorContext, select } from "~/lib/edit"
import { ControlButton } from "./ControlButton"
export const UndoButton = () => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    return (
        <ControlButton disabled={!state || !select.canUndo(state)} onClick={() => dispatch?.({ type: "UNDO" })}>
            ⟲
        </ControlButton>
    )
}
