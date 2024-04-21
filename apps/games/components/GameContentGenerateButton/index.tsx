"use client"
import { PropsWithChildren, useState } from "react"
import { generate } from "./generate"
import styles from "./index.module.scss"
export type Props<TContent = unknown> = PropsWithChildren<{
    code: string
    onGenerated: (value: TContent) => Promise<void>
}>
export const GameContentGenerateButton = ({ children, code, onGenerated }: Props) => {
    const [generating, setGenerating] = useState(false)
    const handleClick = () => {
        ;(async () => {
            setGenerating(true)
            try {
                const generated = await generate(code)
                await onGenerated(generated)
            } catch (e) {
                alert(e)
            } finally {
                setGenerating(false)
            }
        })()
    }
    return (
        <button className={styles.cta} disabled={generating} onClick={generating ? undefined : handleClick}>
            {children}
        </button>
    )
}
