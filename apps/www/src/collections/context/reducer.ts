import { UUID } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Action"
import DEFAULT_COLLECTION_NAME from "./DEFAULT_COLLECTION_NAME"
import { State } from "./State"
const cleanEntities = (entities: State["entities"], collections: State["collections"]): State["entities"] => {
    return Object.fromEntries(
        Object.entries(entities).filter(([uuid]) => Object.values(collections).some(uuids => uuids.has(uuid))),
    )
}
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "ADD_COLLECTION": {
            if (prevState.collections[action.payload]) {
                return {
                    ...prevState,
                    currentCollection: action.payload,
                }
            }
            return {
                ...prevState,
                collections: {
                    ...prevState.collections,
                    [action.payload]: new Set<UUID>(),
                },
                currentCollection: action.payload,
            }
        }
        case "ADD_TO_CURRENT_COLLECTION": {
            const previousSet = prevState.collections[prevState.currentCollection]
            return {
                ...prevState,
                collections: {
                    ...prevState.collections,
                    [prevState.currentCollection]: new Set<UUID>([
                        ...Array.from(previousSet ?? []),
                        action.payload.entity.uuid,
                    ]),
                },
                entities: {
                    ...prevState.entities,
                    [action.payload.entity.uuid]: action.payload,
                },
            }
        }
        case "CLOSE": {
            return {
                ...prevState,
                open: false,
            }
        }
        case "INITIALIZE": {
            return action.payload
        }
        case "OPEN": {
            return {
                ...prevState,
                open: true,
            }
        }
        case "REMOVE_COLLECTION": {
            const collections = { ...prevState.collections }
            delete collections[action.payload]
            let defaultCollectionName = Object.keys(collections).sort()[0]
            if (!defaultCollectionName) {
                collections[DEFAULT_COLLECTION_NAME] = new Set<UUID>()
                defaultCollectionName = DEFAULT_COLLECTION_NAME
            }
            return {
                ...prevState,
                collections,
                currentCollection:
                    action.payload === prevState.currentCollection
                        ? defaultCollectionName
                        : prevState.currentCollection,
                entities: cleanEntities(prevState.entities, collections),
            }
        }
        case "REMOVE_FROM_CURRENT_COLLECTION": {
            const set = new Set<UUID>(prevState.collections[prevState.currentCollection] ?? [])
            set.delete(action.payload)
            const collections = { ...prevState.collections, [prevState.currentCollection]: set }
            return {
                ...prevState,
                collections,
                entities: cleanEntities(prevState.entities, collections),
            }
        }
        case "RENAME_COLLECTION": {
            const [oldName, newName] = action.payload
            if (oldName === newName || !prevState.collections[oldName] || prevState.collections[newName]) {
                return prevState
            }
            const collections = { ...prevState.collections }
            collections[newName] = collections[oldName]
            delete collections[oldName]
            return {
                ...prevState,
                collections,
                currentCollection: prevState.currentCollection === oldName ? newName : prevState.currentCollection,
            }
        }
        case "SET_CURRENT_COLLECTION": {
            if (!prevState.collections[action.payload]) {
                return prevState
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
