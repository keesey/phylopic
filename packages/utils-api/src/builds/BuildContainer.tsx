import React from "react"
import { BuildContext } from "./BuildContext"
export interface BuildContainerProps {
    children: React.ReactNode
    initialValue?: number | (() => number)
}
export const BuildContainer: React.FC<BuildContainerProps> = ({ children, initialValue }) => {
    const contextValue = React.useState(initialValue ?? NaN)
    return <BuildContext.Provider value={contextValue}>{children}</BuildContext.Provider>
}
