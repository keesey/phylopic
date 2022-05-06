import { FC, ReactNode, useState } from "react"
import BuildContext from "./BuildContext"
export interface Props {
    children: ReactNode
    initialValue?: number | (() => number)
}
const BuildContainer: FC<Props> = ({ children, initialValue }) => {
    const contextValue = useState(initialValue ?? NaN)
    return <BuildContext.Provider value={contextValue}>{children}</BuildContext.Provider>
}
export default BuildContainer
