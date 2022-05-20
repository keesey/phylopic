import { normalizeNomen } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Actions"
import { State } from "./State"

const reducer: Reducer<State, Action> = (prevState, action) => {
    console.info(action)
    switch (action.type) {
        case "APPEND_PART": {
            return {
                ...prevState,
                modified: normalizeNomen([...prevState.modified, action.payload]),
            }
        }
        case "INITIALIZE": {
            return {
                ...action.payload,
                modified: normalizeNomen(action.payload.modified),
                original: normalizeNomen(action.payload.original),
            }
        }
        case "REMOVE_PART": {
            return {
                ...prevState,
                modified: normalizeNomen([...prevState.modified].filter((_, index) => index !== action.meta.index)),
            }
        }
        case "SET_CLASS": {
            return {
                ...prevState,
                modified: normalizeNomen(
                    prevState.modified.map((part, index) =>
                        index === action.meta.index ? { ...part, class: action.payload } : part,
                    ),
                ),
            }
        }
        case "SET_TEXT": {
            return {
                ...prevState,
                modified: normalizeNomen(
                    prevState.modified.map((part, index) =>
                        index === action.meta.index ? { ...part, text: action.payload } : part,
                    ),
                ),
            }
        }
        case "UPDATE_NAME": {
            return {
                ...prevState,
                modified: normalizeNomen(action.payload),
            }
        }
        case "UPDATE_PART": {
            return {
                ...prevState,
                modified: normalizeNomen(
                    prevState.modified.map((part, index) => (index === action.meta.index ? action.payload : part)),
                ),
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
