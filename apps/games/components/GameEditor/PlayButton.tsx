"use client"
import { FC, useContext, useState } from "react"
import { EditorContext, select } from "~/lib/edit"
import { GamePlayer } from "../GamePlayer"
import { MobileContainer } from "../MobileContainer"
import { Modal } from "../Modal"
import { ControlButton } from "./ControlButton"
export interface Props {
    code: string
}
export const PlayButton: FC<Props> = props => {
    const [playing, setPlaying] = useState(false)
    const [state] = useContext(EditorContext) ?? []
    if (!state) {
        return null
    }
    const current = select.current(state)
    return (
        <>
            <ControlButton onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "⏵"}</ControlButton>
            {playing && (
                <Modal onClose={() => setPlaying(false)}>
                    <MobileContainer>
                        <GamePlayer {...props} gameContent={current} />
                    </MobileContainer>
                </Modal>
            )}
        </>
    )
}
