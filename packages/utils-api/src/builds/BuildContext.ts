import { createContext, Dispatch, SetStateAction } from "react"
export const BuildContext = createContext<Readonly<[number, Dispatch<SetStateAction<number>>]> | undefined>(undefined)
export default BuildContext
