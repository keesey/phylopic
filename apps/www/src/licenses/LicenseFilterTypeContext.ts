import { createContext, type Dispatch, type SetStateAction } from "react"
import type { LicenseFilterType } from "~/models/LicenseFilterType"

const LicenseFilterTypeContext = createContext<
    Readonly<[LicenseFilterType, Dispatch<SetStateAction<LicenseFilterType>>]> | undefined
>(undefined)

export default LicenseFilterTypeContext
