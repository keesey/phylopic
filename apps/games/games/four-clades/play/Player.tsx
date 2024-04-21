import { FC, useMemo } from "react"
import { BoardContainer, Submission } from "./BoardContainer"
import { InitializeAction } from "./actions"
import Board from "../board/Board"
import { adjudicate } from "./adjudicate"
import { Game } from "../models"
export interface Props {
    game: Game
}
export const Player: FC<Props> = ({ game }) => {
    const data = useMemo<InitializeAction["payload"]>(() => {
        return {
            images: game.answers.reduce<InitializeAction["payload"]["images"]>(
                (prev, answer) => [...prev, ...answer.images],
                [],
            ),
            numSets: game.answers.length,
        }
    }, [game])
    const handleSubmit = async (submission: Submission) => {
        return adjudicate(game, submission)
    }
    return (
        <BoardContainer data={data} onError={e => alert(e)} onSubmit={handleSubmit}>
            <Board />
        </BoardContainer>
    )
}
