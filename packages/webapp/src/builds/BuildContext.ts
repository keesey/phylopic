import { createContext, Dispatch, SetStateAction } from "react"
const BuildContext = createContext<Readonly<[number, Dispatch<SetStateAction<number>>]> | undefined>(undefined)
export default BuildContext
