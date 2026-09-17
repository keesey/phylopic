"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useCallback, useEffect, useState } from "react"
import { GamePlayerClient } from "~/components/GamePlayerClient"
import { GAMES } from "~/games/GAMES"
import { generatePracticeGame } from "~/lib/games/generatePracticeGame"
import styles from "./GameGenerator.module.scss"
export interface Props {
    code: string
}
export const GameGenerator: FC<Props> = ({ code }) => {
    const [generating, setGenerating] = useState(false)
    const [game, setGame] = useState<unknown | null>(null)
    const [error, setError] = useState<string | null>(null)
    const generatePracticeGameInstance = useCallback(() => {
        setGame(null)
        if (!GAMES[code]) {
            setGenerating(false)
            return setError("Invalid game.")
        }
        setGenerating(true)
        setError(null)
        ;(async () => {
            try {
                setGame(await generatePracticeGame(code))
            } catch (e) {
                setError(String(e))
            } finally {
                setGenerating(false)
            }
        })()
    }, [code])
    useEffect(() => {
        generatePracticeGameInstance()
    }, [generatePracticeGameInstance])
    if (error) {
        return (
            <div className={styles.main}>
                <p>{error}</p>
                <a onClick={() => generatePracticeGameInstance()}>Try again.</a>
            </div>
        )
    }
    if (generating || !game) {
        return (
            <div className={styles.main}>
                <p>Creating practice game&hellip;</p>
                <Loader />
            </div>
        )
    }
    return (
        <GamePlayerClient key="player" code={code} gameContent={game} onNewGame={() => generatePracticeGameInstance()} />
    )
}
