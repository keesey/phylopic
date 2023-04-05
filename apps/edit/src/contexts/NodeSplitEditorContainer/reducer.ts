import { normalizeNomina, stringifyNormalized } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Actions"
import { State } from "./State"

const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "COMPLETE_SAVE": {
            return {
                ...prevState,
                error: undefined,
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
        case "MOVE_NAME": {
            const json = stringifyNormalized(action.payload)
            return {
                ...prevState,
                error: undefined,
                created: {
                    ...prevState.created,
                    value: {
                        ...prevState.created.value,
                        names:
                            action.meta.destination === "original"
                                ? prevState.created.value.names.filter(name => stringifyNormalized(name) !== json)
                                : normalizeNomina([...prevState.created.value.names, action.payload]),
                    },
                },
                original: {
                    ...prevState.original,
                    value: {
                        ...prevState.original.value,
                        names:
                            action.meta.destination === "created"
                                ? prevState.original.value.names.filter(name => stringifyNormalized(name) !== json)
                                : normalizeNomina([...prevState.original.value.names, action.payload]),
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
