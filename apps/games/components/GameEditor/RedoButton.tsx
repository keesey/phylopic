"use client"
import { FC, useContext } from "react"
import { EditorContext, select } from "~/lib/edit"
import { ControlButton } from "./ControlButton"
export interface Props {
    readOnly: boolean
}
export const RedoButton: FC<Props> = ({ readOnly }) => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    return (
        <ControlButton
            disabled={readOnly || !state || !select.canRedo(state)}
            onClick={() => (readOnly ? undefined : dispatch?.({ type: "REDO" }))}
        >
            ⟳
        </ControlButton>
    )
}
