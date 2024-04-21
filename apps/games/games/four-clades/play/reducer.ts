import { UUID } from "@phylopic/utils"
import { type Reducer } from "react"
import { shuffle } from "~/lib/utils"
import { BoardImageState, type BoardState } from "./BoardState"
import { Action } from "./actions"
import { select } from "./select"
import { MAX_MISTAKES } from "./MAX_MISTAKES"
const updateImageStates = (images: BoardState["images"], map: (imageState: BoardImageState) => BoardImageState) => {
    return Object.entries(images)
        .map(([key, value]) => [key, map(value)] as [UUID, BoardImageState])
        .reduce<BoardState["images"]>((prev, [key, value]) => ({ ...prev, [key]: value }), {})
}
const deselectAll = (images: BoardState["images"]) => {
    return updateImageStates(images, state => (state.mode === "selected" ? { ...state, mode: null } : state))
}
const selectOne = (images: BoardState["images"], uuid: UUID) => {
    return updateImageStates(images, state =>
        state.mode === null && state.image.uuid === uuid
            ? {
                  ...state,
                  mode: "selected",
              }
            : state,
    )
}
const deselectOne = (images: BoardState["images"], uuid: UUID) => {
    return updateImageStates(images, state =>
        state.mode === "selected" && state.image.uuid === uuid
            ? {
                  ...state,
                  mode: null,
              }
            : state,
    )
}
const reducer: Reducer<BoardState, Action> = (prevState, action) => {
    switch (action.type) {
        case "DESELECT": {
            return {
                ...prevState,
                discrepancy: null,
                images: deselectOne(prevState.images, action.payload),
            }
        }
        case "DESELECT_ALL": {
            return {
                ...prevState,
                discrepancy: null,
                images: deselectAll(prevState.images),
            }
        }
        case "INITIALIZE": {
            const images = action.payload.images.reduce<BoardState["images"]>(
                (prev, image) => ({ ...prev, [image.uuid]: { image, mode: null } }),
                {},
            )
            const numImages = Object.keys(images).length
            if (numImages / action.payload.numAnswers !== Math.floor(numImages / action.payload.numAnswers)) {
                return prevState
            }
            return {
                answers: [],
                discrepancy: null,
                lastSubmission: [],
                mistakes: 0,
                images,
                imageUUIDs: shuffle(Object.keys(images)),
                totalAnswers: action.payload.numAnswers,
            }
        }
        case "LOSS": {
            const mistakes = Math.min(MAX_MISTAKES, prevState.mistakes + 1)
            const lost = mistakes === MAX_MISTAKES
            const images = updateImageStates(prevState.images, imageState =>
                imageState.mode === "submitted" ? { ...imageState, mode: lost ? null : "selected" } : imageState,
            )
            return {
                ...prevState,
                discrepancy: action.payload,
                images,
                mistakes,
            }
        }
        case "SELECT": {
            if (select.countSelected(prevState) >= select.imagesPerAnswer(prevState)) {
                return prevState
            }
            return {
                ...prevState,
                discrepancy: null,
                images: selectOne(prevState.images, action.payload),
                lastSubmission: [],
            }
        }
        case "SHUFFLE": {
            return {
                ...prevState,
                imageUUIDs: shuffle(prevState.imageUUIDs),
            }
        }
        case "SUBMIT": {
            const submission = select.getSelectedUUIDs(prevState)
            if (
                submission.length !== select.imagesPerAnswer(prevState) ||
                prevState.answers.length >= prevState.totalAnswers ||
                prevState.lastSubmission.join(",") === submission.join(",")
            ) {
                return prevState
            }
            return {
                ...prevState,
                discrepancy: null,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "selected" ? { ...imageState, mode: "submitted" } : imageState,
                ),
                lastSubmission: submission,
            }
        }
        case "SUBMIT_CANCEL": {
            return {
                ...prevState,
                discrepancy: null,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "submitted" ? { ...imageState, mode: "selected" } : imageState,
                ),
            }
        }
        case "WIN": {
            const submittedCount = select.countSubmitted(prevState)
            if (
                submittedCount !== select.imagesPerAnswer(prevState) ||
                prevState.answers.length >= prevState.totalAnswers
            ) {
                return prevState
            }
            return {
                ...prevState,
                answers: [...prevState.answers, action.payload],
                discrepancy: null,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "submitted" ? { ...imageState, mode: "completed" } : imageState,
                ),
                lastSubmission: [],
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
