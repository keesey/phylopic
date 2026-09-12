"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useCallback, useEffect, useState } from "react"
import { GamePlayerClient } from "~/components/GamePlayerClient"
import { GAMES } from "~/games/GAMES"
import { generate } from "~/lib/games/generate"
import styles from "./GameGenerator.module.scss"
export interface Props {
    code: string
}
const LOCAL_STORAGE_KEY = "@phylopic/games/four-clades/practice/game"
export const GameGenerator: FC<Props> = ({ code }) => {
    const [generating, setGenerating] = useState(false)
    const [game, setGame] = useState<unknown | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (saved) {
            try {
                setGame(JSON.parse(saved))
                return
            } catch {
                // Must be corrupt.
                localStorage.removeItem(LOCAL_STORAGE_KEY)
            }
        }
    }, [])
    useEffect(() => {
        if (game) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(game))
        }
    }, [game])
    const generatePracticeGame = useCallback(() => {
        setGame(null)
        if (!GAMES[code]) {
            setGenerating(false)
            return setError("Invalid game.")
        }
        setGenerating(true)
        setError(null)
        ;(async () => {
            try {
                setGame(await generate(code))
            } catch (e) {
                setError(String(e))
            } finally {
                setGenerating(false)
            }
        })()
    }, [code])
    if (error) {
        return (
            <div className={styles.main}>
                <p>{error}</p>
                <a onClick={() => generatePracticeGame()}>Try again.</a>
            </div>
        )
    }
    if (generating) {
        return (
            <div className={styles.main}>
                <p>Creating practice game&hellip;</p>
                <Loader />
            </div>
        )
    }
    return <GamePlayerClient key="player" code={code} gameContent={game} onNewGame={() => generatePracticeGame()} />
}
