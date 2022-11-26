import { UUID } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Action"
import { State } from "./State"
const DEFAULT_COLLECTION_NAME = "My Collection"
const cleanEntities = (entities: State["entities"], collections: State["collections"]): State["entities"] => {
    return Object.fromEntries(
        Object.entries(entities).filter(([uuid]) => Object.values(collections).some(uuids => uuids.has(uuid))),
    )
}
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "ADD_COLLECTION": {
            if (prevState.collections[action.payload]) {
                return prevState
            }
            return {
                ...prevState,
                collections: {
                    ...prevState.collections,
                    [action.payload]: new Set<UUID>(),
                },
            }
        }
        case "ADD_TO_CURRENT_COLLECTION": {
            const name = prevState.currentCollection ?? DEFAULT_COLLECTION_NAME
            const previousSet = prevState.collections[name]
            return {
                ...prevState,
                collections: {
                    ...prevState.collections,
                    [name]: new Set<UUID>([
                        ...Array.from(previousSet ?? []),
                        action.payload.entity.uuid,
                    ]),
                },
                currentCollection: name,
                entities: {
                    ...prevState.entities,
                    [action.payload.entity.uuid]: action.payload,
                },
            }
        }
        case "INITIALIZE": {
            return action.payload
        }
        case "REMOVE_COLLECTION": {
            const collections = { ...prevState.collections }
            delete collections[action.payload]
            const entities = cleanEntities(prevState.entities, collections)
            return {
                ...prevState,
                collections,
                currentCollection: action.payload === prevState.currentCollection ? null : prevState.currentCollection,
                entities,
            }
        }
        case "REMOVE_FROM_CURRENT_COLLECTION": {
            if (!prevState.currentCollection) {
                return prevState
            }
            const set = new Set<UUID>(prevState.collections[prevState.currentCollection] ?? [])
            set.delete(action.payload)
            const collections = { ...prevState.collections, [prevState.currentCollection]: set }
            const entities = cleanEntities(prevState.entities, collections)
            return {
                ...prevState,
                collections,
                entities,
            }
        }
        case "RENAME_COLLECTION": {
            if (
                action.payload[0] === action.payload[1] ||
                !prevState.collections[action.payload[0]] ||
                prevState.collections[action.payload[1]] ||
                !action.payload[1]
            ) {
                return prevState
            }
            return {
                ...prevState,
                collections: {
                    ...prevState.collections,
                    [action.payload[1]]: prevState.collections[action.payload[0]],
                },
                currentCollection:
                    prevState.currentCollection === action.payload[0] ? action.payload[1] : prevState.currentCollection,
            }
        }
        case "SET_CURRENT_COLLECTION": {
            if (!action.payload || !prevState.collections[action.payload]) {
                return {
                    ...prevState,
                    currentCollection: null,
                }
            }
            return {
                ...prevState,
                currentCollection: action.payload,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
