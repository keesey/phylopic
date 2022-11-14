import { Reducer } from "react"
import { Action } from "./actions"
import { State } from "./State"
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "REQUEST_CHANGE": {
            return {
                ...prevState,
                changeRequested: true,
            }
        }
        case "REQUEST_PARENT": {
            return {
                ...prevState,
                parentRequested: true,
            }
        }
        case "RESET": {
            return {
                ...prevState,
                changeRequested: false,
                parentRequested: false,
                pending: false,
                text: "",
            }
        }
        case "SET_PENDING": {
            return {
                ...prevState,
                pending: action.payload,
            }
        }
        case "SET_TEXT": {
            return {
                ...prevState,
                text: action.payload,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
