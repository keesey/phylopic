"use client"
import { FC, useContext } from "react"
import { EditorContext } from "~/lib/edit"
import { GameContentGenerateButton } from "../GameContentGenerateButton"
export interface Props {
    code: string
    readOnly: boolean
}
export const RegenerateButton: FC<Props> = ({ code, readOnly }) => {
    const [, dispatch] = useContext(EditorContext) ?? []
    const handleGenerated = async (content: unknown) => {
        if (!readOnly) {
            dispatch?.({ type: "PUSH", payload: content })
        }
    }
    return (
        <GameContentGenerateButton code={code} onGenerated={handleGenerated} readOnly={readOnly}>
            Regenerate
        </GameContentGenerateButton>
    )
}
