import {
    CladesBoardContainer,
    CladesGameImage,
    CladesGame as CladesGameModel,
    generateCladesGame,
    getBuild,
    shuffle,
} from "@phylopic/games"
import { Loader } from "@phylopic/ui"
import { FC, useCallback, useEffect, useState } from "react"
import styles from "./index.module.scss"
import Board from "./Board"
const CladesGame: FC = () => {
    const [game, setGame] = useState<CladesGameModel | null>(null)
    const [images, setImages] = useState<readonly CladesGameImage[]>([])
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        ;(async () => {
            try {
                const build = await getBuild()
                const game = await generateCladesGame(build)
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
    }, [])
    const handleSubmit = useCallback(async () => {
        return { type: "loss", discrepancy: 1 } as const
    }, [])
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
        <CladesBoardContainer data={images} onError={error => setError(String(error))} onSubmit={handleSubmit}>
            <Board />
        </CladesBoardContainer>
    )
}
export default CladesGame
