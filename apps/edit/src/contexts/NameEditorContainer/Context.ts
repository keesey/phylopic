import { createContext, Dispatch } from "react"
import { Action } from "./Actions"
import { State } from "./State"

const Context = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
export default Context
