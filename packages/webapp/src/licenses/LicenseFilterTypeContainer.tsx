import { FC, ReactNode, useState } from "react"
import { LicenseFilterType } from "~/models/LicenseFilterType"
import LicenseFilterTypeContext from "./LicenseFilterTypeContext"
export interface Props {
    children?: ReactNode
    initialValue?: LicenseFilterType
}
const LicenseTypeFilterContainer: FC<Props> = ({ children, initialValue }) => {
    const contextValue = useState(initialValue)
    return <LicenseFilterTypeContext.Provider value={contextValue}>{children}</LicenseFilterTypeContext.Provider>
}
export default LicenseTypeFilterContainer
