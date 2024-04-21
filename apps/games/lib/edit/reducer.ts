import { type Reducer } from "react"
import { shuffle } from "~/lib/utils"
import { EditorState } from "./EditorState"
import { Action } from "./actions"
import { select } from "./select"
const reducer: Reducer<EditorState<unknown>, Action<unknown>> = (prevState, action) => {
    switch (action.type) {
        case "REDO": {
            if (!select.canRedo(prevState)) {
                return prevState
            }
            return {
                ...prevState,
                currentIndex: prevState.currentIndex + 1,
            }
        }
        case "INITIALIZE": {
            return {
                currentIndex: 0,
                history: [action.payload],
            }
        }
        case "PUSH": {
            const history = [...prevState.history.slice(0, prevState.currentIndex + 1), action.payload]
            return {
                ...prevState,
                currentIndex: history.length - 1,
                history,
            }
        }
        case "UNDO": {
            if (!select.canUndo(prevState)) {
                return prevState
            }
            return {
                ...prevState,
                currentIndex: prevState.currentIndex - 1,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
