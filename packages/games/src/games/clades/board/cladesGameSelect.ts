import { CladesBoardState } from "./CladesBoardState"
const isLost = (state: CladesBoardState) => state.mistakes >= 4
const isWon = (state: CladesBoardState) => state.answers.length === state.totalAnswers
const isOver = (state: CladesBoardState) => isWon(state) || isLost(state)
const imagesPerAnswer = (state: CladesBoardState) => Math.floor(Object.keys(state.images).length / state.totalAnswers)
export const cladesGameSelect = {
    imagesPerAnswer,
    isLost,
    isOver,
    isWon,
}
