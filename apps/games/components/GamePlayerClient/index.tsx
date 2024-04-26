import dynamic from "next/dynamic"
import { FC } from "react"
import { Game as FourCladesGame } from "~/games/four-clades/models"
const FourCladesPlayer = dynamic(() =>
    import("~/games/four-clades/play/PlayerClient").then(({ PlayerClient }) => PlayerClient),
)
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
