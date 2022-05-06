import { useContext, useMemo } from "react"
import LicenseFilterTypeContext from "./LicenseFilterTypeContext"
const useLicenseFilterQuery = () => {
    const [licenses] = useContext(LicenseFilterTypeContext) ?? []
    return useMemo(
        () => ({
            ...(licenses === "publicdomain" ? { license_by: "false" } : null),
            ...(licenses === "publicdomain" || licenses === "-nc" || licenses === "-nc-sa"
                ? { license_nc: "false" }
                : null),
            ...(licenses === "publicdomain" || licenses === "-sa" || licenses === "-nc-sa"
                ? { license_sa: "false" }
                : null),
            embed: "specificNode",
        }),
        [licenses],
    )
}
export default useLicenseFilterQuery
