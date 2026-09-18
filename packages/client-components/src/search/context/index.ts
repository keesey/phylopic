"use client"
import { createContext, type Dispatch } from "react"
import type { Action } from "./actions"
import type { State } from "./State"
export const SearchContext = createContext<Readonly<[State, Dispatch<Action>]> | undefined>(undefined)
