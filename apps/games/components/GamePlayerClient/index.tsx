import { FC } from "react"
import { Game as FourCladesGame } from "~/games/four-clades/models"
import { PlayerClient as FourCladesPlayer } from "~/games/four-clades/play/PlayerClient"
export interface Props {
    code: string
    gameContent: unknown
}
export const GamePlayerClient: FC<Props> = ({ code, gameContent }) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesPlayer game={gameContent as FourCladesGame} />
        }
        default: {
            return <p>Unrecognized game.</p>
        }
    }
}
