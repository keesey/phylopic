import { isEmailAddress, isImageMediaType, isLicenseURL, normalizeText } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Actions"
import { State } from "./State"

const normalizeTextOrUndefined = (s: string | undefined) => (typeof s === "string" && normalizeText(s)) || undefined
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
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
        case "RESET": {
            return {
                ...prevState,
                deleteRequested: false,
                error: undefined,
                modified: prevState.original,
            }
        }
        case "SET_ATTRIBUTION": {
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    contribution: {
                        ...prevState.modified.contribution,
                        attribution: normalizeTextOrUndefined(action.payload) ?? null,
                    },
                },
            }
        }
        case "SET_CONTRIBUTOR": {
            const contributor = normalizeText(action.payload)
            if (!isEmailAddress(contributor)) {
                return prevState
            }
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    contribution: {
                        ...prevState.modified.contribution,
                        contributor,
                    },
                },
            }
        }
        case "SET_MEDIA_TYPE": {
            if (!isImageMediaType(action.payload)) {
                return prevState
            }
            return {
                ...prevState,
                mediaType: action.payload,
            }
        }
        case "SET_LICENSE": {
            if (!isLicenseURL(action.payload)) {
                return prevState
            }
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    contribution: {
                        ...prevState.modified.contribution,
                        license: action.payload,
                    },
                },
            }
        }
        case "SET_LINEAGE": {
            const general = action.payload.length > 1 ? action.payload[0] : null
            const specific = action.payload[action.payload.length - 1]
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    contribution: {
                        ...prevState.modified.contribution,
                        general,
                        specific,
                    },
                    lineage: action.payload,
                },
            }
        }
        case "SET_SPONSOR": {
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    contribution: {
                        ...prevState.modified.contribution,
                        sponsor: normalizeTextOrUndefined(action.payload) ?? null,
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
