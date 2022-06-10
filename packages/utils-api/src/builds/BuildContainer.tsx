import React, { FC, ReactNode, useState } from "react"
import BuildContext from "./BuildContext"
export interface BuildContainerProps {
    children: ReactNode
    initialValue?: number | (() => number)
}
export const BuildContainer: FC<BuildContainerProps> = ({ children, initialValue }) => {
    const contextValue = useState(initialValue ?? NaN)
    return <BuildContext.Provider value={contextValue}>{children}</BuildContext.Provider>
}
export default BuildContainer
