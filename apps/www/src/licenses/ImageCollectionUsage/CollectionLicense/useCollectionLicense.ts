import { Image } from "@phylopic/api-models"
import { ExtendedLicenseURL, LicenseURL } from "@phylopic/utils"
import { useMemo } from "react"
const useCollectionLicense = (images: readonly Image[]): ExtendedLicenseURL => {
    return useMemo(() => {
        let by = false
        let nc = false
        let sa = false
        let v4 = false
        for (const image of images) {
            switch (image._links.license.href) {
                case "https://creativecommons.org/licenses/by-nc-sa/3.0/": {
                    by = nc = sa = true
                    break
                }
                case "https://creativecommons.org/licenses/by-nc/3.0/": {
                    by = nc = true
                    break
                }
                case "https://creativecommons.org/licenses/by-sa/3.0/": {
                    by = sa = true
                    break
                }
                case "https://creativecommons.org/licenses/by/3.0/": {
                    by = true
                    break
                }
                case "https://creativecommons.org/licenses/by/4.0/": {
                    by = v4 = true
                    break
                }
            }
            if (by && nc && sa && v4) {
                break
            }
        }
        if (by) {
            if (nc) {
                if (sa) {
                    return v4
                        ? "https://creativecommons.org/licenses/by-nc-sa/4.0/"
                        : "https://creativecommons.org/licenses/by-nc-sa/3.0/"
                }
                return v4
                    ? "https://creativecommons.org/licenses/by-nc/4.0/"
                    : "https://creativecommons.org/licenses/by-nc/3.0/"
            }
            if (sa) {
                return v4
                    ? "https://creativecommons.org/licenses/by-sa/4.0/"
                    : "https://creativecommons.org/licenses/by-sa/3.0/"
            }
            return v4 ? "https://creativecommons.org/licenses/by/4.0/" : "https://creativecommons.org/licenses/by/3.0/"
        }
        return "https://creativecommons.org/publicdomain/mark/1.0/"
    }, [images])
}
export default useCollectionLicense
