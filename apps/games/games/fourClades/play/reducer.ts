import { UUID } from "@phylopic/utils"
import { type Reducer } from "react"
import { shuffle } from "../../../utils"
import { BoardImageState, type BoardState } from "./BoardState"
import { Action } from "./actions"
const updateImageStates = (images: BoardState["images"], map: (imageState: BoardImageState) => BoardImageState) => {
    return Object.entries(images)
        .map(([key, value]) => [key, map(value)] as [UUID, BoardImageState])
        .reduce<BoardState["images"]>((prev, [key, value]) => ({ ...prev, [key]: value }), {})
}
const deselectAll = (images: BoardState["images"]) => {
    return updateImageStates(images, state => (state.mode === "selected" ? { ...state, mode: null } : state))
}
const select = (images: BoardState["images"], uuid: UUID) => {
    return updateImageStates(images, state =>
        state.mode === null && state.image.uuid === uuid
            ? {
                  ...state,
                  mode: "selected",
              }
            : state,
    )
}
const deselect = (images: BoardState["images"], uuid: UUID) => {
    return updateImageStates(images, state =>
        state.mode === "selected" && state.image.uuid === uuid
            ? {
                  ...state,
                  mode: null,
              }
            : state,
    )
}
const countImagesInMode = (images: BoardState["images"], mode: BoardImageState["mode"]) =>
    Object.values(images).reduce<number>((prev, image) => (image.mode === mode ? prev + 1 : prev), 0)
const reducer: Reducer<BoardState, Action> = (prevState, action) => {
    switch (action.type) {
        case "DESELECT": {
            return {
                ...prevState,
                discrepancy: null,
                images: deselect(prevState.images, action.payload),
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
            if (numImages / action.payload.numSets !== Math.floor(numImages / action.payload.numSets)) {
                return prevState
            }
            return {
                answers: [],
                discrepancy: null,
                mistakes: 0,
                images,
                imageUUIDs: shuffle(Object.keys(images)),
                totalAnswers: action.payload.numSets,
            }
        }
        case "LOSS": {
            return {
                ...prevState,
                discrepancy: action.payload,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "submitted" ? { ...imageState, mode: "selected" } : imageState,
                ),
                mistakes: prevState.mistakes + 1,
            }
        }
        case "SELECT": {
            if (
                countImagesInMode(prevState.images, "selected") >=
                Object.keys(prevState.images).length / prevState.totalAnswers
            ) {
                return prevState
            }
            return {
                ...prevState,
                discrepancy: null,
                images: select(prevState.images, action.payload),
            }
        }
        case "SHUFFLE": {
            return {
                ...prevState,
                imageUUIDs: shuffle(prevState.imageUUIDs),
            }
        }
        case "SUBMIT": {
            const selectedCount = countImagesInMode(prevState.images, "selected")
            if (selectedCount !== 4 || prevState.answers.length === 4) {
                return prevState
            }
            return {
                ...prevState,
                discrepancy: null,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "selected" ? { ...imageState, mode: "submitted" } : imageState,
                ),
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
            const submittedCount = countImagesInMode(prevState.images, "submitted")
            if (submittedCount !== 4 || prevState.answers.length === 4) {
                return prevState
            }
            return {
                ...prevState,
                answers: [
                    ...prevState.answers,
                    {
                        imageUUIDs: Object.values(prevState.images)
                            .filter(state => state.mode === "submitted")
                            .map(state => state.image.uuid),
                        node: action.payload,
                    },
                ],
                discrepancy: null,
                images: updateImageStates(prevState.images, imageState =>
                    imageState.mode === "submitted" ? { ...imageState, mode: "completed" } : imageState,
                ),
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
