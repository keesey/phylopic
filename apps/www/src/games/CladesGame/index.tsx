import {
    CladesBoardContainer,
    CladesGameImage,
    CladesGame as CladesGameModel,
    CladesGameSubmission,
    generateCladesGame,
    getBuild
} from "@phylopic/games"
import { Loader } from "@phylopic/ui"
import { FC, useCallback, useMemo, useState } from "react"
import Board from "./Board"
import styles from "./index.module.scss"
const MIN_DEPTH = 8
const NUM_SETS = 4
const IMAGES_PER_SET = 4
const CladesGame: FC = () => {
    const [gameRequested, setGameRequested] = useState(false)
    const [game, setGame] = useState<CladesGameModel | null>(null)
    const [error, setError] = useState<string | null>(null)
    const startNewGame = useCallback(() => {
        setGame(null)
        setGameRequested(true)
        ;(async () => {
            try {
                const build = await getBuild()
                const game = await generateCladesGame(build, MIN_DEPTH, NUM_SETS, IMAGES_PER_SET)
                setGame(game)
            } catch (e) {
                setError(String(e))
            }
        })()
    }, [])
    const handleSubmit = useCallback(
        async (submission: CladesGameSubmission) => {
            if (submission.size === 4) {
                const answer = game?.answers.find(answer => answer.images.every(image => submission.has(image.uuid)))
                if (answer) {
                    return { type: "win", node: answer.node } as const
                }
            }
            return { type: "loss", discrepancy: 1 } as const
        },
        [game?.answers],
    )
    const images = useMemo(() => {
        return game?.answers
            ? game.answers.reduce<CladesGameImage[]>((prev, answer) => [...prev, ...answer.images], [])
            : []
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
        <CladesBoardContainer
            data={{ images, numSets: NUM_SETS }}
            onError={error => setError(String(error))}
            onSubmit={handleSubmit}
        >
            <Board onRestart={() => startNewGame()} />
        </CladesBoardContainer>
    )
}
export default CladesGame
