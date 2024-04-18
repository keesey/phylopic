import {
    CladesBoardContainer,
    CladesGameImage,
    CladesGame as CladesGameModel,
    CladesGameSubmission,
    generateCladesGame,
    getBuild,
    shuffle,
} from "@phylopic/games"
import { Loader } from "@phylopic/ui"
import { FC, useCallback, useEffect, useState } from "react"
import styles from "./index.module.scss"
import Board from "./Board"
const MIN_DEPTH = 8
const NUM_SETS = 4
const IMAGES_PER_SET = 4
const CladesGame: FC = () => {
    const [game, setGame] = useState<CladesGameModel | null>(null)
    const [images, setImages] = useState<readonly CladesGameImage[]>([])
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        if (!game) {
            ;(async () => {
                try {
                    const build = await getBuild()
                    const game = await generateCladesGame(build, MIN_DEPTH, NUM_SETS, IMAGES_PER_SET)
                    const images = game.answers.reduce<readonly CladesGameImage[]>(
                        (prev, answer) => [...prev, ...answer.images],
                        [],
                    )
                    setGame(game)
                    setImages(shuffle(images))
                } catch (e) {
                    setError(String(e))
                }
            })()
        }
    }, [game])
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
    if (error) {
        return (
            <p className={styles.error}>
                <strong>Error!</strong> {error}
            </p>
        )
    }
    if (!game) {
        return <Loader />
    }
    return (
        <CladesBoardContainer data={{images, numSets: NUM_SETS}} onError={error => setError(String(error))} onSubmit={handleSubmit}>
            <Board />
        </CladesBoardContainer>
    )
}
export default CladesGame
