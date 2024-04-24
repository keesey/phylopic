"use server"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer, Submission } from "./BoardContainer"
import { adjudicate } from "./adjudicate"
import { createInitial } from "./createInitial"
export interface PlayerProps {
    game: Game
}
export const Player = async ({ game }: PlayerProps) => {
    const data = await createInitial(game)
    const handleSubmit = async (submission: Submission) => {
        "use server"
        return await adjudicate(game, submission)
    }
    return (
        <BoardContainer data={data} submit={handleSubmit}>
            <Board />
        </BoardContainer>
    )
}
