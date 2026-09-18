import { type FC, type ReactNode, type Reducer, useReducer } from "react"
import type { Action } from "./actions"
import AssignmentContext from "./AssignmentContext"
import reducer from "./reducer"
import type { State } from "./State"

export type Props = {
    children: ReactNode
    initialState: State
}

const AssignmentContainer: FC<Props> = ({ children, initialState }) => {
    const value = useReducer<Reducer<State, Action>>(reducer, initialState)
    return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>
}

export default AssignmentContainer
