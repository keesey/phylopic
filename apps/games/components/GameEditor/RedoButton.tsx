"use client"
import { useContext } from "react"
import { EditorContext, select } from "~/lib/edit"
import { ControlButton } from "./ControlButton"
export const RedoButton = () => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    return (
        <ControlButton disabled={!state || !select.canRedo(state)} onClick={() => dispatch?.({ type: "REDO" })}>
            ⟳
        </ControlButton>
    )
}
