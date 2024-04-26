import { FC } from "react"
import { Game as FourCladesGame } from "~/games/four-clades/models"
import { Player as FourCladesPlayer } from "~/games/four-clades/play"
import { CalendarDate } from "~/lib/datetime"
export interface Props {
    code: string
    date: CalendarDate
    gameContent: unknown
}
export const GamePlayer: FC<Props> = ({ code, date, gameContent }) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesPlayer date={date} game={gameContent as FourCladesGame} />
        }
        default: {
            return <p>Unrecognized game.</p>
        }
    }
}
