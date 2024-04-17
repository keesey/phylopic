import { ImageWithEmbedded } from "@phylopic/api-models"
import { CladesGame as CladesGameModel, getBuild, getClades, shuffle } from "@phylopic/games"
import { ImageThumbnailView, Loader } from "@phylopic/ui"
import { FC, useEffect, useState } from "react"
const CladesGame: FC = () => {
    const [game, setGame] = useState<CladesGameModel | null>(null)
    const [images, setImages] = useState<readonly ImageWithEmbedded[]>([])
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        ;(async () => {
            try {
                const build = await getBuild()
                const game = await getClades(build)
                const images = game.answers.reduce<readonly ImageWithEmbedded[]>(
                    (prev, answer) => [...prev, ...answer.images],
                    [],
                )
                setGame(game)
                setImages(shuffle(images))
            } catch (e) {
                console.error(e)
                setError(String(e))
            }
        })()
    }, [])
    if (error) {
        return (
            <p>
                <strong>Error!</strong> {error}
            </p>
        )
    }
    if (!game) {
        return <Loader />
    }
    return (
        <>
            {images.map(image => (
                <ImageThumbnailView key={image.uuid} value={image} />
            ))}
        </>
    )
}
export default CladesGame
