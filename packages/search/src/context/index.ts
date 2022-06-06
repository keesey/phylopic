import { createContext, Dispatch } from "react"
import { Action } from "./actions"
import { State } from "./State"
export const SearchContext = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
export default SearchContext
