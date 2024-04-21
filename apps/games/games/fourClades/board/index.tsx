import { Loader } from "@phylopic/ui"
import { FC, useCallback, useMemo, useState } from "react"
import Board from "./Board"
import styles from "./index.module.scss"
import { Game, GameImage } from "../models"
import { getBuild } from "~/lib/api"
import { generate } from "../generate"
import { BoardContainer, adjudicate } from "../play"
const MIN_DEPTH = 5
const NUM_ANSWERS = 4
const IMAGES_PER_ANSWER = 4
const CladesGame: FC = () => {
    const [gameRequested, setGameRequested] = useState(false)
    const [game, setGame] = useState<Game | null>(null)
    const [error, setError] = useState<string | null>(null)
    const startNewGame = useCallback(() => {
        setGame(null)
        setGameRequested(true)
        ;(async () => {
            try {
                const build = await getBuild()
                const game = await generate(build, MIN_DEPTH, NUM_ANSWERS, IMAGES_PER_ANSWER)
                setGame(game)
            } catch (e) {
                setError(String(e))
            }
        })()
    }, [])
    const images = useMemo(() => {
        return game?.answers ? game.answers.reduce<GameImage[]>((prev, answer) => [...prev, ...answer.images], []) : []
    }, [game?.answers])
    if (error) {
        return (
            <section className={styles.main}>
                <p className={styles.error}>
                    <strong>Error!</strong> {error}
                </p>
                <button className={styles.cta} onClick={() => startNewGame()}>
                    Try again
                </button>
            </section>
        )
    }
    if (!game) {
        if (gameRequested) {
            return <Loader />
        }
        return (
            <section className={styles.main}>
                <button className={styles.cta} onClick={() => startNewGame()}>
                    Start a game
                </button>
            </section>
        )
    }
    return (
        <BoardContainer
            data={{ images, numSets: NUM_ANSWERS }}
            onError={error => setError(String(error))}
            onSubmit={async submission => adjudicate(game, submission)}
        >
            <Board onRestart={() => startNewGame()} />
        </BoardContainer>
    )
}
export default CladesGame
