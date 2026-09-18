import { createContext, type Dispatch } from "react"
import type { Action } from "./actions"
import type { State } from "./State"
const AssignmentContext = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
export default AssignmentContext
