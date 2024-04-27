"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
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
    const generatePracticeGame = useCallback(() => {
        setGame(null)
        if (!GAMES[code]) {
            return setError("Invalid game.")
        }
        setError(null)
        ;(async () => {
            try {
                const game = await generate(code)
                setGame(game)
            } catch (e) {
                setError(String(e))
            }
        })()
    }, [code])
    const initial = useRef<boolean>(false)
    useEffect(() => {
        if (!initial.current) {
            initial.current = true
            generatePracticeGame()
        }
    }, [generatePracticeGame, initial])
    if (error) {
        return (
            <div className={styles.main}>
                <p>{error}</p>
                <a onClick={() => generatePracticeGame()}>Try again.</a>
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
    return <GamePlayerClient key="player" code={code} gameContent={game} onNewGame={() => generatePracticeGame()} />
}
