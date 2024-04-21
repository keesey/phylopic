"use client"
import { getMeta } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { GameContentGenerateButton } from "../GameContentGenerateButton"
export interface Props<TContent = unknown> {
    code: string
    onGenerated: (value: GameInstance<TContent>) => Promise<void>
}
export const ButtonContainer = ({ code, onGenerated }: Props) => {
    const handleGenerated = async (content: unknown) => {
        const meta = getMeta()
        await onGenerated({ content, meta })
    }
    return (
        <GameContentGenerateButton code={code} onGenerated={handleGenerated}>
            Generate Random
        </GameContentGenerateButton>
    )
}
