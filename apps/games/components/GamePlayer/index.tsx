import { Loader } from "@phylopic/client-components"
import { FC, Suspense } from "react"
import { Game as FourCladesGame } from "~/games/four-clades/models"
import { Player as FourCladesPlayer } from "~/games/four-clades/play/Player"
export interface Props {
    code: string
    gameContent: unknown
}
const Player: FC<Props> = ({ code, gameContent }) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesPlayer game={gameContent as FourCladesGame} />
        }
        default: {
            return <p>Unrecognized game.</p>
        }
    }
}
export const GamePlayer: FC<Props> = ({ code, gameContent }) => {
    return (
        <Suspense fallback={<Loader />}>
            <Player code={code} gameContent={gameContent} />
        </Suspense>
    )
}
