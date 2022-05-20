import { createContext, Dispatch } from "react"
import { Action } from "./actions"
import { State } from "./State"
const SearchContext = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
export default SearchContext
