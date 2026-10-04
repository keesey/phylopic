/** Mirrors www CollectionLicense/getLicenseFlags — aggregate license terms across images. */
export type LicenseFlags = {
    by: boolean
    nc: boolean
    sa: boolean
    v4: boolean
}

export type ImageWithLicenseLink = {
    _links: { license: { href: string } }
}

export const getLicenseFlags = (images: readonly ImageWithLicenseLink[]): LicenseFlags => {
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
            default: {
                break
            }
        }
        if (by && nc && sa && v4) {
            break
        }
    }
    return { by, nc, sa, v4 }
}
