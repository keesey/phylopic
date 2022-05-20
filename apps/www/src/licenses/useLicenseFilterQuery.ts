import { ImageListParameters } from "@phylopic/api-models"
import { useContext, useMemo } from "react"
import LicenseFilterTypeContext from "./LicenseFilterTypeContext"
const useLicenseFilterQuery = () => {
    const [licenses] = useContext(LicenseFilterTypeContext) ?? []
    return useMemo<ImageListParameters>(
        () => ({
            ...(licenses === "publicdomain" ? { filter_license_by: "false" } : null),
            ...(licenses === "publicdomain" || licenses === "-nc" || licenses === "-nc-sa"
                ? { filter_license_nc: "false" }
                : null),
            ...(licenses === "publicdomain" || licenses === "-sa" || licenses === "-nc-sa"
                ? { filter_license_sa: "false" }
                : null),
            embed_specificNode: "true",
        }),
        [licenses],
    )
}
export default useLicenseFilterQuery
