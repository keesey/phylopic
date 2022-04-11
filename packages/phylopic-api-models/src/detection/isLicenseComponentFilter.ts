import { LicenseComponentFilter } from ".."
import isLicenseComponent from "./isLicenseComponent"
export const isLicenseComponentFilter = (x: unknown): x is LicenseComponentFilter =>
    isLicenseComponent(x) || (typeof x === "string" && isLicenseComponent(x.replace(/^-/, "")))
export default isLicenseComponentFilter
