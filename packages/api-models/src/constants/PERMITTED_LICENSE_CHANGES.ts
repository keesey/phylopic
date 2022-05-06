import { LicenseURL, ValidLicenseURL } from "@phylopic/utils/dist/models/types"
export const PERMITTED_LICENSE_CHANGES: Readonly<Record<LicenseURL, readonly ValidLicenseURL[]>> = {
    "https://creativecommons.org/licenses/by-nc-sa/3.0/": [
        "https://creativecommons.org/licenses/by/4.0/",
        "https://creativecommons.org/publicdomain/zero/1.0/",
    ],
    "https://creativecommons.org/licenses/by-nc/3.0/": [
        "https://creativecommons.org/licenses/by/4.0/",
        "https://creativecommons.org/publicdomain/zero/1.0/",
    ],
    "https://creativecommons.org/licenses/by-sa/3.0/": [
        "https://creativecommons.org/licenses/by/4.0/",
        "https://creativecommons.org/publicdomain/zero/1.0/",
    ],
    "https://creativecommons.org/licenses/by/3.0/": [
        "https://creativecommons.org/licenses/by/4.0/",
        "https://creativecommons.org/publicdomain/zero/1.0/",
    ],
    "https://creativecommons.org/licenses/by/4.0/": ["https://creativecommons.org/publicdomain/zero/1.0/"],
    "https://creativecommons.org/publicdomain/mark/1.0/": [],
    "https://creativecommons.org/publicdomain/zero/1.0/": [],
}
export default PERMITTED_LICENSE_CHANGES
