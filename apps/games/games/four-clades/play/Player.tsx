"use server"
import { CalendarDate } from "~/lib/datetime"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer, Submission } from "./BoardContainer"
import { adjudicate } from "./adjudicate"
import { createInitial } from "./createInitial"
export interface PlayerProps {
    date?: CalendarDate
    game: Game
}
export const Player = async ({ date, game }: PlayerProps) => {
    const data = await createInitial(game)
    const handleSubmit = async (submission: Submission) => {
        "use server"
        return await adjudicate(game, submission)
    }
    return (
        <BoardContainer data={data} gameDate={date} submit={handleSubmit}>
            <Board />
        </BoardContainer>
    )
}
