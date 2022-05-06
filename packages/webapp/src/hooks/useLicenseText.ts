import { LicenseURL } from "@phylopic/utils"
import { useMemo } from "react"
const NAMES: Readonly<Record<LicenseURL, string>> = {
    "https://creativecommons.org/licenses/by-nc-sa/3.0/":
        "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported",
    "https://creativecommons.org/licenses/by-nc/3.0/": "Creative Commons Attribution-NonCommercial 3.0 Unported",
    "https://creativecommons.org/licenses/by-sa/3.0/": "Creative Commons Attribution-ShareAlike 3.0 Unported",
    "https://creativecommons.org/licenses/by/3.0/": "Creative Commons Attribution 3.0 Unported",
    "https://creativecommons.org/licenses/by/4.0/": "Creative Commons Attribution 4.0 International",
    "https://creativecommons.org/publicdomain/mark/1.0/": "Public Domain Mark 1.0",
    "https://creativecommons.org/publicdomain/zero/1.0/": "CC0 1.0 Universal",
}
const SHORT_NAMES: Readonly<Record<LicenseURL, string>> = {
    "https://creativecommons.org/licenses/by-nc-sa/3.0/": "CC BY-NC-SA 3.0",
    "https://creativecommons.org/licenses/by-nc/3.0/": "CC BY-NC 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/": "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by/3.0/": "CC BY 3.0",
    "https://creativecommons.org/licenses/by/4.0/": "CC BY 4.0",
    "https://creativecommons.org/publicdomain/mark/1.0/": "PDM 1.0",
    "https://creativecommons.org/publicdomain/zero/1.0/": "CC0 1.0",
}
const useLicenseText = (licenseURL: LicenseURL, short = false) => {
    return useMemo(() => (short ? SHORT_NAMES[licenseURL] : NAMES[licenseURL]) ?? null, [licenseURL, short])
}
export default useLicenseText
