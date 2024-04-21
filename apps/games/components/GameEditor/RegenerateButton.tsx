"use client"
import { FC, useContext } from "react"
import { EditorContext } from "~/lib/edit"
import { GameContentGenerateButton } from "../GameContentGenerateButton"
export interface Props {
    code: string
}
export const RegenerateButton: FC<Props> = ({ code }) => {
    const [, dispatch] = useContext(EditorContext) ?? []
    const handleGenerated = async (content: unknown) => {
        dispatch?.({ type: "PUSH", payload: content })
    }
    return (
        <GameContentGenerateButton code={code} onGenerated={handleGenerated}>
            Regenerate
        </GameContentGenerateButton>
    )
}
