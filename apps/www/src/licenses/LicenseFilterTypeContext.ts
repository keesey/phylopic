import { createContext, Dispatch, SetStateAction } from "react"
import { LicenseFilterType } from "~/models/LicenseFilterType"
const LicenseFilterTypeContext = createContext<
    Readonly<[LicenseFilterType, Dispatch<SetStateAction<LicenseFilterType>>]> | undefined
>(undefined)
export default LicenseFilterTypeContext
