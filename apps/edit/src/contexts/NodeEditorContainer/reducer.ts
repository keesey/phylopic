import { normalizeNomen, normalizeNomina, stringifyNormalized } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Actions"
import { State } from "./State"

const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "ADD_NAME": {
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    node: {
                        ...prevState.modified.node,
                        names: normalizeNomina([...prevState.modified.node.names, action.payload]),
                    },
                },
            }
        }
        case "COMPLETE_SAVE": {
            return {
                ...prevState,
                error: undefined,
                original: prevState.modified,
                pending: false,
            }
        }
        case "FAIL_SAVE": {
            return {
                ...prevState,
                error: String(action.payload),
                pending: false,
            }
        }
        case "INITIALIZE": {
            return action.payload
        }
        case "REMOVE_NAME": {
            const json = stringifyNormalized(normalizeNomen(action.payload))
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    node: {
                        ...prevState.modified.node,
                        names: normalizeNomina([
                            prevState.modified.node.names[0],
                            ...prevState.modified.node.names
                                .slice(1)
                                .filter(name => stringifyNormalized(name) !== json),
                        ]),
                    },
                },
            }
        }
        case "RESET": {
            return {
                ...prevState,
                error: undefined,
                modified: prevState.original,
            }
        }
        case "SET_CANONICAL_NAME": {
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    node: {
                        ...prevState.modified.node,
                        names: normalizeNomina([normalizeNomen(action.payload), ...prevState.modified.node.names]),
                    },
                },
            }
        }
        case "START_SAVE": {
            return {
                ...prevState,
                error: undefined,
                pending: true,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
