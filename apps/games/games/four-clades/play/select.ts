import { BoardState } from "./BoardState"
import { MAX_MISTAKES } from "./MAX_MISTAKES"
const countSelected = (state: BoardState) =>
    Object.values(state.images).filter(image => image.mode === "selected").length
const countSubmitted = (state: BoardState) =>
    Object.values(state.images).filter(image => image.mode === "submitted").length
const hasSelection = (state: BoardState) => Object.values(state.images).some(image => image.mode === "selected")
const getSelectedUUIDs = (state: BoardState) =>
    Object.values(state.images)
        .filter(image => image.mode === "selected")
        .map(image => image.image.uuid)
        .sort()
const isLost = (state: BoardState) => state.mistakes >= MAX_MISTAKES
const isOver = (state: BoardState) => isWon(state) || isLost(state)
const isSubmittable = (state: BoardState) => countSelected(state) === imagesPerAnswer(state)
const isWon = (state: BoardState) => state.answers.length === state.totalAnswers
const imagesPerAnswer = (state: BoardState) => Math.floor(Object.keys(state.images).length / state.totalAnswers)
export const select = {
    countSelected,
    countSubmitted,
    getSelectedUUIDs,
    hasSelection,
    imagesPerAnswer,
    isLost,
    isOver,
    isSubmittable,
    isWon,
}
