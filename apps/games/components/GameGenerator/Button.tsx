"use client"
import { Loader } from "@phylopic/ui"
import { useState } from "react"
import { GameInstance } from "~/lib/s3/GameInstance"
import styles from "./BUtton.module.scss"
import { generate } from "./generate"
export interface Props<TContent = unknown> {
    code: string
    onGenerated: (value: GameInstance<TContent>) => Promise<void>
}
export const Button = ({ code, onGenerated }: Props) => {
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
    if (generating) {
        return <Loader />
    }
    return (
        <button className={styles.cta} onClick={handleClick}>
            Generate Random
        </button>
    )
}
