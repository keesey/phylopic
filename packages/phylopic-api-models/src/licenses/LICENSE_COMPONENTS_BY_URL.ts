import { LicenseComponent } from "./LicenseComponent"
import { LicenseURL } from "./LicenseURL"
export const LICENSE_COMPONENTS_BY_URL: Readonly<Record<LicenseURL, ReadonlySet<LicenseComponent>>> = {
    "https://creativecommons.org/licenses/by-nc-sa/3.0/": new Set(["by", "nc", "sa"]),
    "https://creativecommons.org/licenses/by-nc/3.0/": new Set(["by", "nc"]),
    "https://creativecommons.org/licenses/by-sa/3.0/": new Set(["by", "sa"]),
    "https://creativecommons.org/licenses/by/3.0/": new Set(["by"]),
    "https://creativecommons.org/licenses/by/4.0/": new Set(["by"]),
    "https://creativecommons.org/publicdomain/mark/1.0/": new Set(),
    "https://creativecommons.org/publicdomain/zero/1.0/": new Set(),
}
export default LICENSE_COMPONENTS_BY_URL
