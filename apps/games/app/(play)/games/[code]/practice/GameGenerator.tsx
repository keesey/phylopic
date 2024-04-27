"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { GamePlayerClient } from "~/components/GamePlayerClient"
import { GAMES } from "~/games/GAMES"
import { generate } from "~/lib/games/generate"
import styles from "./GameGenerator.module.scss"
export interface Props {
    code: string
}
export const GameGenerator: FC<Props> = ({ code }) => {
    const [game, setGame] = useState<unknown | null>(null)
    const [error, setError] = useState<string | null>(null)
    const generatePracticeGame = useMemo(
        () => () => {
            setGame(null)
            if (!GAMES[code]) {
                return setError("Invalid game.")
            }
            setError(null)
            ;(async () => {
                try {
                    setGame(await generate(code))
                } catch (e) {
                    setError(String(e))
                }
            })()
        },
        [code],
    )
    useEffect(() => generatePracticeGame(), [generatePracticeGame])
    if (error) {
        return (
            <div className={styles.main}>
                <p>{error}</p>
            </div>
        )
    }
    if (!game) {
        return (
            <div className={styles.main}>
                <p>Creating practice game&hellip;</p>
                <Loader />
            </div>
        )
    }
    return <GamePlayerClient code={code} gameContent={game} onNewGame={() => generatePracticeGame()} />
}
