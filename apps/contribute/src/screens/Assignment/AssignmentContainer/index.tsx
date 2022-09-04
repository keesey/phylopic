import { FC, ReactNode, Reducer, useReducer } from "react"
import { Action } from "./actions"
import AssignmentContext from "./AssignmentContext"
import reducer from "./reducer"
import { State } from "./State"
export type Props = {
    children: ReactNode
    initialState: State
}
const AssignmentContainer: FC<Props> = ({ children, initialState }) => {
    const value = useReducer<Reducer<State, Action>>(reducer, initialState)
    return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>
}
export default AssignmentContainer
