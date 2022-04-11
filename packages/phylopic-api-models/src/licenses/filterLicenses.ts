import LICENSE_URLS from "phylopic-utils/src/models/constants/LICENSE_URLS"
import LICENSE_COMPONENTS_BY_URL from "../constants/LICENSE_COMPONENTS_BY_URL"
import { LicenseComponent } from "../types/LicenseComponent"
import { LicenseComponentFilter } from "../types/LicenseComponentFilter"
export const filterLicenses = (filters: readonly LicenseComponentFilter[]) => {
    let licenses = [...LICENSE_URLS]
    filters.forEach(filter => {
        if (!licenses.length) {
            return
        }
        if (filter.charAt(0) === "-") {
            const component = filter.slice(1) as LicenseComponent
            licenses = licenses.filter(license => !LICENSE_COMPONENTS_BY_URL[license].has(component))
        } else {
            licenses = licenses.filter(license => LICENSE_COMPONENTS_BY_URL[license].has(filter as LicenseComponent))
        }
    })
    return licenses
}
export default filterLicenses
