import { FC } from "react"
import { Game as FourCladesGame } from "~/games/four-clades/models"
import { Player as FourCladesPlayer } from "~/games/four-clades/play"
export interface Props {
    code: string
    gameContent: unknown
}
export const GamePlayer: FC<Props> = ({ code, gameContent }) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesPlayer game={gameContent as FourCladesGame} />
        }
        default: {
            return <p>Unrecognized game.</p>
        }
    }
}
