import { LicenseComponent } from "./LicenseComponent"
import { LicenseComponentFilter } from "./LicenseComponentFilter"
import LICENSE_COMPONENTS_BY_URL from "./LICENSE_COMPONENTS_BY_URL"
import ALL_LICENSES from "./LICENSE_URLS"
export const filterLicenses = (filters: readonly LicenseComponentFilter[]) => {
    let licenses = [...ALL_LICENSES]
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
