import { describe, expect, it } from "vitest"
import { getCombinedLicenseUrl } from "./getLicenseForFlags.js"

const image = (licenseHref: string) => ({ _links: { license: { href: licenseHref } } })

describe("getCombinedLicenseUrl", () => {
    it("returns public domain mark when all images are PD", () => {
        expect(getCombinedLicenseUrl([image("https://creativecommons.org/publicdomain/mark/1.0/")])).toBe(
            "https://creativecommons.org/publicdomain/mark/1.0/",
        )
    })

    it("combines to strictest BY-NC-SA when any image requires it", () => {
        expect(
            getCombinedLicenseUrl([
                image("https://creativecommons.org/licenses/by/4.0/"),
                image("https://creativecommons.org/licenses/by-nc-sa/3.0/"),
            ]),
        ).toBe("https://creativecommons.org/licenses/by-nc-sa/4.0/")
    })
})
