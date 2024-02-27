import { type Node } from "@phylopic/api-models"
import { type UUID } from "@phylopic/utils"
import type { FSAWithPayload } from "flux-standard-action"
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type Dispatch,
    type FC,
    type PropsWithChildren,
    type Reducer,
} from "react"
import { type AgeResult } from "~/external/useNodeAge"
export type AgeEntry = Readonly<{
    ageResult: AgeResult | null
    uuid: UUID
}>
export type State = readonly AgeEntry[]
export const AgesContext = createContext<{ dispatch: Dispatch<Action>; state: State } | undefined>(undefined)
export type AgesProviderProps = PropsWithChildren<{
    nodes: readonly Pick<Node, "uuid">[]
}>
export type ResetAction = FSAWithPayload<"RESET", AgesProviderProps["nodes"]>
export type SetAction = FSAWithPayload<"SET", AgeEntry>
export type Action = ResetAction | SetAction
export const AgesProvider: FC<AgesProviderProps> = ({ children, nodes }) => {
    const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, [])
    useEffect(() => {
        dispatch({ type: "RESET", payload: nodes })
    }, [dispatch, nodes])
    return <AgesContext.Provider value={{ dispatch, state }}>{children}</AgesContext.Provider>
}
const reducer: Reducer<State, Action> = (prevState, action) => {
    switch (action.type) {
        case "RESET": {
            return action.payload.map(({ uuid }) => {
                const existing = prevState.find(entry => entry.uuid === uuid)
                if (existing) {
                    return existing
                }
                return { ageResult: null, uuid }
            })
        }
        case "SET": {
            const existingIndex = prevState.findIndex(entry => entry.uuid === action.payload.uuid)
            if (existingIndex >= 0) {
                return [...prevState.slice(0, existingIndex), action.payload, ...prevState.slice(existingIndex + 1)]
            }
        }
        default: {
            return prevState
        }
    }
}
export const useAgeResult = (uuid: UUID | undefined): AgeResult | null => {
    const { state } = useContext(AgesContext) ?? {}
    return useMemo(() => {
        if (!state || !uuid) {
            return null
        }
        const index = state.findIndex(entry => entry.uuid === uuid)
        if (index < 0) {
            return null
        }
        const existing = state[index].ageResult
        if (!existing) {
            return null
        }
        if (index === 0) {
            if (!existing) {
                const extantAncestor = state.slice(1).find(n => n.ageResult && n.ageResult.ages.includes(0))
                if (extantAncestor) {
                    return {
                        ...extantAncestor,
                        ages: [0, 0],
                    }
                }
            }
            return existing
        } else if (existing.ages[0] === 0) {
            return null
        }
        for (const descendant of state.slice(0, index)) {
            if (descendant.ageResult && descendant.ageResult.ages[0] >= existing.ages[0]) {
                return null
            }
        }
        return existing
    }, [state])
}
export const useIsTerminal = (uuid: UUID | undefined) => {
    const { state } = useContext(AgesContext) ?? {}
    return Boolean(uuid && state?.[0]?.uuid === uuid)
}
