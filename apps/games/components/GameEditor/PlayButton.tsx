"use client"
import { useState } from "react"
import { ControlButton } from "./ControlButton"
export const PlayButton = () => {
    const [playing, setPlaying] = useState(false)
    // :TODO: modal with playable game
    return <ControlButton onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "⏵"}</ControlButton>
}
