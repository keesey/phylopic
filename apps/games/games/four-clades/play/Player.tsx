import { CalendarDate } from "~/lib/datetime"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer } from "./BoardContainer"
import { createInitial } from "./createInitial"
export interface PlayerProps {
    date?: CalendarDate
    game: Game
}
export const Player = async ({ date, game }: PlayerProps) => {
    const data = await createInitial(game)
    return (
        <BoardContainer data={data} game={game} gameDate={date}>
            <Board />
        </BoardContainer>
    )
}
