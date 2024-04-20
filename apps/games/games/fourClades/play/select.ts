import { BoardState } from "./BoardState"
const isLost = (state: BoardState) => state.mistakes >= 4
const isWon = (state: BoardState) => state.answers.length === state.totalAnswers
const isOver = (state: BoardState) => isWon(state) || isLost(state)
const imagesPerAnswer = (state: BoardState) => Math.floor(Object.keys(state.images).length / state.totalAnswers)
export const select = {
    imagesPerAnswer,
    isLost,
    isOver,
    isWon,
}
