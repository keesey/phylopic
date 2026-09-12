"use client"
import { PropsWithChildren, useState } from "react"
import { generate } from "./generate"
import styles from "./index.module.scss"
export type Props<TContent = unknown> = PropsWithChildren<{
    code: string
    onGenerated: (value: TContent) => Promise<void>
    readOnly?: boolean
}>
export const GameContentGenerateButton = ({ children, code, onGenerated, readOnly = false }: Props) => {
    const [generating, setGenerating] = useState(false)
    const handleClick = () => {
        if (!readOnly) {
            void (async () => {
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
    }
    return (
        <button
            className={styles.cta}
            disabled={readOnly || generating}
            onClick={generating || readOnly ? undefined : handleClick}
        >
            {children}
        </button>
    )
}
