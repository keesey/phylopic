import { normalizeQuery } from "@phylopic/api-models"
import { compareStrings } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "../context/actions"
import { State } from "../context/State"
import getSortIndex from "../utils/getSortIndex"
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "ADD_EXTERNAL_MATCHES": {
            if (action.meta.basis !== prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                externalMatches: Array.from(
                    new Set<string>([...action.payload.map(normalizeQuery), ...prevState.externalMatches]),
                ).sort(
                    (a, b) => getSortIndex(a, prevState.text) - getSortIndex(b, prevState.text) || compareStrings(a, b),
                ),
            }
        }
        case "ADD_EXTERNAL_RESULTS": {
            if (action.meta.basis !== prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                externalResults: {
                    ...prevState.externalResults,
                    [action.meta.authority]: {
                        ...prevState.externalResults[action.meta.authority],
                        [action.meta.namespace]: {
                            ...prevState.externalResults[action.meta.authority]?.[action.meta.namespace],
                            ...action.payload,
                        },
                    },
                },
            }
        }
        case "RESET": {
            return {
                ...prevState,
                externalMatches: [],
                externalResults: {},
                focused: false,
                imageResults: [],
                internalMatches: [],
                nodeResults: [],
                text: "",
            }
        }
        case "RESET_INTERNAL": {
            return {
                ...prevState,
                imageResults: [],
                internalMatches: [],
                nodeResults: [],
            }
        }
        case "RESOLVE_EXTERNAL": {
            return {
                ...prevState,
                resolutions: {
                    ...prevState.resolutions,
                    [action.meta.authority]: {
                        ...prevState.resolutions[action.meta.authority],
                        [action.meta.namespace]: {
                            ...prevState.resolutions[action.meta.authority]?.[action.meta.namespace],
                            [action.meta.objectID]: action.payload.uuid,
                        },
                    },
                },
                resolvedNodes: {
                    ...prevState.resolvedNodes,
                    [action.payload.uuid]: action.payload,
                },
            }
        }
        case "SET_ACTIVE": {
            if (prevState.focused === action.payload) {
                return prevState
            }
            return {
                ...prevState,
                focused: action.payload,
            }
        }
        case "SET_IMAGE_RESULTS": {
            if (action.meta.basis !== prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                imageResults: action.payload,
            }
        }
        case "SET_INTERNAL_MATCHES": {
            if (action.meta.basis !== prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                internalMatches: action.payload,
            }
        }
        case "SET_NODE_RESULTS": {
            if (action.meta.basis !== prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                nodeResults: action.payload,
            }
        }
        case "SET_TEXT": {
            const normalized = normalizeQuery(action.payload)
            const text = normalized.length >= 2 ? normalized : ""
            if (text === prevState.text) {
                return prevState
            }
            return {
                ...prevState,
                externalResults: {},
                focused: text ? prevState.focused : false,
                imageResults: [],
                nodeResults: [],
                matches: [],
                text,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
