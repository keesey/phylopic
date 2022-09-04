import { createContext, Dispatch } from "react"
import { Action } from "./actions"
import { State } from "./State"
const AssignmentContext = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
export default AssignmentContext
